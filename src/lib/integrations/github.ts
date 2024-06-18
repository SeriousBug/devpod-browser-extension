import { WithPartial } from "@lib/utils/typeUtils/WithPartial";
import { Integration } from "./core";
import {
  EIntegrationParseError,
  EIntegrationParseErrorData,
  EIntegrationTargetError,
} from "./error";
import { EErrorOptions } from "@lib/utils/error";
import { findDOMNodeByContent } from "@lib/utils/dom/findDOMNodeByContent";

type EGithubParseErrorData = EIntegrationParseErrorData & {
  integration: "Github";
  isPR: boolean;
};
export class EGithubParseError extends EIntegrationParseError {
  constructor({
    message = "Unable to extract repository or branch from URL",
    data,
  }: WithPartial<EErrorOptions<EGithubParseErrorData>, "message">) {
    super({ message, data });
    this.name = "EGithubParseErrorData";
  }
}

function getCloneDetails({ document, url }: { document: Document; url: URL }) {
  // The ref selector button is present on the tree view of the repository.
  const refSelector = document.querySelector(
    ".ref-selector-button-text-container",
  );
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
  // This is the element that says "merge into ... from [branch]". The href for
  // the link will always be the repo and the branch that is being merged from,
  // whether it's a fork or within the same repository.
  const prSource =
    document.querySelector<HTMLAnchorElement>(".pull .head-ref a");
  if (prSource && prSource.href) {
    const match =
      /^[/](?<repo>[^/]+[/][^/]+)([/]tree[/](?<branch>[^?#]+))?/i.exec(
        prSource.pathname,
      )?.groups;
    if (match && match.repo && match.branch) {
      return { repo: match.repo, branch: match.branch } as const;
    }
  }

  // Otherwise, we don't support wherever we are. Trying to insert links when we
  // are unsure leads to broken stuff, so we'll just skip.
}

function isPrPathname(pathname: string) {
  return /^[/][^/]+[/][^/]+[/]pull[/]\d+/i.test(pathname);
}

function parseGithubPathname(
  pathname: string,
): { repo?: string; branch?: string } | undefined {
  return /^[/](?<repo>[^/]+[/][^/]+)([/]tree[/](?<branch>[^?#]+))?/i.exec(
    pathname,
  )?.groups;
}

export const Github: Integration = {
  platform: "Github",
  supports(url: URL) {
    return (
      url.hostname === "github.com" &&
      (isPrPathname(url.pathname) || !!parseGithubPathname(url.pathname))
    );
  },
  getButtonTarget(document) {
    const node =
      document.querySelector<HTMLElement>(".gh-header-actions") ??
      findDOMNodeByContent("button", "Code")?.parentElement;
    if (!node) {
      throw new EIntegrationTargetError({
        message: "Unable to find button target",
        data: {
          integration: "Github",
          url: window.location.href,
        },
      });
    }
    return node;
  },
  getCloneUrl({ url, document }) {
    const details = getCloneDetails({ document, url });
    if (details) {
      const { repo, branch } = details;
      const branchSuffix = branch ? `@${branch}` : "";
      return `https://github.com/${repo}${branchSuffix}`;
    }
  },
};
