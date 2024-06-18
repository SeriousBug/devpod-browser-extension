import { WithPartial } from "@lib/utils/typeUtils/WithPartial";
import { Integration } from "./core";
import {
  EIntegrationParseError,
  EIntegrationParseErrorData,
  EIntegrationTargetError,
} from "./error";
import { EErrorOptions } from "@lib/utils/error";
import { findDOMNodeByContent } from "@lib/utils/dom/findDOMNodeByContent";

type ESourcehutParseErrorData = EIntegrationParseErrorData & {
  integration: "Sourcehut";
  isPR: boolean;
};
export class ESourcehutParseError extends EIntegrationParseError {
  constructor({
    message = "Unable to extract repository or branch from URL",
    data,
  }: WithPartial<EErrorOptions<ESourcehutParseErrorData>, "message">) {
    super({ message, data });
    this.name = "ESourcehutParseErrorData";
  }
}

function getCloneDetails({ document }: { document: Document }) {
  // For the log view, we can get teh URL from the link next to the branch icon
  const logLink = document
    .querySelector(".event .icon-code-branch")
    ?.parentElement?.querySelector<HTMLAnchorElement>("a");
  if (logLink && logLink.href) {
    const results =
      /^[/](?<repo>[^/]+[/][^/]+)([/]commit[/](?<branch>[^?#]+))?/i.exec(
        logLink.href,
      )?.groups;
    if (results && "repo" in results) {
      return { repo: results.repo, branch: results.branch } as const;
    }
  }

  // On the tree view of the repository, we can look at the URL to get back to
  // the repo root.
  const repoRootBreadcrumb = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a.nav-link") ?? [],
  ).find((a) => a && a.textContent && /tree/i.test(a.textContent));
  if (repoRootBreadcrumb && repoRootBreadcrumb.href) {
    const results = /^[/](?<repo>[^/]+[/][^/]+)([/]tree)/i.exec(
      repoRootBreadcrumb.href,
    )?.groups;
    if (results && "repo" in results) {
      return { repo: results.repo } as const;
    }
  }

  // Otherwise, we don't support wherever we are. Trying to insert links when we
  // are unsure leads to broken stuff, so we'll just skip.
}

function isCommitPathname(pathname: string) {
  return /^[/][^/]+[/][^/]+[/]commit[/].+/i.test(pathname);
}

function parseSourcehutPathname(
  pathname: string,
): { repo?: string; branch?: string } | undefined {
  return /^[/](?<repo>[^/]+[/][^/]+)([/]tree[/](?<branch>[^?#]+))?/i.exec(
    pathname,
  )?.groups;
}

export const Sourcehut: Integration = {
  platform: "sourcehut",
  supports(url: URL) {
    return (
      url.hostname === "git.sr.ht" &&
      (isCommitPathname(url.pathname) || !!parseSourcehutPathname(url.pathname))
    );
  },
  getButtonTarget() {
    // The commit view has a container for buttons
    const buttonContainer = findDOMNodeByContent("a", "patch")?.parentElement;
    if (buttonContainer) {
      return buttonContainer;
    }

    // On the summary page
    const cloneSection = findDOMNodeByContent(
      "h3",
      "clone",
    )?.parentElement?.querySelector("dl");
    if (cloneSection) {
      return cloneSection;
    }

    // The top nav bar. Maybe this should always be the target? It's common
    // between all pages, and there's no other clone button usually anyway.
    const header = document.querySelector<HTMLElement>(
      ".header-tabbed .container .nav-tabs",
    );
    if (header) {
      return header;
    }

    throw new EIntegrationTargetError({
      message: "Unable to find button target",
      data: {
        integration: "sourcehut",
        url: window.location.href,
      },
    });
  },
  getCloneUrl({ document }) {
    const details = getCloneDetails({ document });
    if (details) {
      const { repo, branch } = details;
      const branchSuffix = branch ? `@${branch}` : "";
      return `https://git.sr.ht/${repo}${branchSuffix}`;
    }
  },
  buttonContainerOverride() {
    return "w-fit mt-4";
  },
};
