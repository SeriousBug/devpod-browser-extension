import { WithPartial } from "@lib/utils/typeUtils/WithPartial";
import { Integration } from "./core";
import {
  EIntegrationParseError,
  EIntegrationParseErrorData,
  EIntegrationTargetError,
} from "./error";
import { EErrorOptions } from "@lib/utils/error";
import _ from "lodash";

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

function isMergeRequestPathname(pathname: string) {
  return /^[/][^/]+[/][^/]+[/]-[/]merge_requests[/]\d+/i.test(pathname);
}

function parseGitlabPathname(
  pathname: string,
): { repo?: string; branch?: string } | undefined {
  return /^[/](?<repo>[^/]+[/][^/]+)([/]-[/]tree[/](?<branch>[^/]+))?/i.exec(
    pathname,
  )?.groups;
}


export const GitLab: Integration = {
  platform: "GitLab",
  supports(url: URL) {
    return /^https?:[/][/]gitlab.com[/][^/]+[/][^/]+/i.test(url.toString());
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
    //
    if (isMergeRequestPathname(url.pathname)) {
      url = 
    }
  },
  buttonClassOverride({ url }) {
    if (isPR(url)) {
      return "ml-2";
    }
  },
};
