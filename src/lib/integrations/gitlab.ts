import { WithPartial } from "@lib/utils/typeUtils/WithPartial";
import { Integration } from "./core";
import {
  EIntegrationParseError,
  EIntegrationParseErrorData,
  EIntegrationTargetError,
} from "./error";
import { EErrorOptions } from "@lib/utils/error";

type EGitLabParseErrorData = EIntegrationParseErrorData & {
  integration: "GitLab";
};
export class EGitLabParseError extends EIntegrationParseError {
  constructor({
    message = "Unable to extract repository or branch from URL",
    data,
  }: WithPartial<EErrorOptions<EGitLabParseErrorData>, "message">) {
    super({ message, data });
    this.name = "EGitLabParseErrorData";
  }
}

function getCloneDetails({ document, url }: { document: Document; url: URL }) {
  // The ref selector button is present on the tree view of the repository.
  const refSelector = document.querySelector(".ref-selector span");
  // If we are in the tree view, we can get the branch name from the ref
  // selector, and the repository is always going to match the URL.
  if (refSelector && refSelector.textContent) {
    const branch = refSelector.textContent.trim();
    const repo = /^[/](?<repo>[^/]+[/][^/]+)[/]?/i.exec(url.pathname)?.groups
      ?.repo;
    if (repo && branch) {
      return { repo, branch } as const;
    }
  }
  // This is the element that says "merge [branch] into ...". The href for
  // the link will always be the repo and the branch that is being merged from,
  // whether it's a fork or within the same repository.
  const mrSource = document.querySelector<HTMLAnchorElement>("a.ref-container");
  if (mrSource && mrSource.href) {
    const match =
      /^[/](?<repo>[^/]+[/][^/]+)([/]-[/]tree[/](?<branch>[^?#]+))?/i.exec(
        mrSource.pathname,
      )?.groups;
    if (match && match.repo && match.branch) {
      return { repo: match.repo, branch: match.branch } as const;
    }
  }

  // Otherwise, we don't support wherever we are. Trying to insert links when we
  // are unsure leads to broken stuff, so we'll just skip.
}

function isMergeRequestPathname(pathname: string) {
  return /^[/][^/]+[/][^/]+[/]-[/]merge_request[/]\d+/i.test(pathname);
}

function parseGitLabPathname(
  pathname: string,
): { repo?: string; branch?: string } | undefined {
  return /^[/](?<repo>[^/]+[/][^/]+)([/]-[/]tree[/](?<branch>[^?#]+))?/i.exec(
    pathname,
  )?.groups;
}

export const GitLab: Integration = {
  platform: "GitLab",
  supports(url: URL) {
    return (
      url.hostname === "gitlab.com" &&
      (isMergeRequestPathname(url.pathname) ||
        !!parseGitLabPathname(url.pathname))
    );
  },
  getButtonTarget(document) {
    const node =
      document.querySelector<HTMLElement>(".project-code-holder")
        ?.parentElement ??
      document.querySelector<HTMLElement>(".tree-controls > div") ??
      document.querySelector<HTMLElement>(".detail-page-header-actions");
    if (!node) {
      throw new EIntegrationTargetError({
        message: "Unable to find button target",
        data: {
          integration: "GitLab",
          url: window.location.href,
        },
      });
    }
    return node;
  },
  getCloneUrl({ document, url }) {
    const details = getCloneDetails({ document, url });
    if (details) {
      const { repo, branch } = details;
      const branchSuffix = branch ? `@${branch}` : "";
      return `https://gitlab.com/${repo}${branchSuffix}`;
    }
  },
  buttonClassOverride({ url }) {
    if (isMergeRequestPathname(url.pathname)) {
      return "ml-2";
    }
  },
};
