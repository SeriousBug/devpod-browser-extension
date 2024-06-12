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

function isPR(url: string | URL) {
  return /[/][^/]+[/][^/]+[/]-[/]merge_requests[/].+/i.test(url.toString());
}

export const GitLab: Integration = {
  platform: "GitLab",
  supports(url: string | URL) {
    return /^https?:[/][/]gitlab.com[/][^/]+[/][^/]+/i.test(url.toString());
  },
  getButtonTarget(document: Document) {
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
  getRepo({ url }) {
    const results =
      /^https?:[/][/][^/]+[/](?<repo>[^/]+[/][^/]+)([/]?tree[/](?<branch>[^?]+))?/i.exec(
        url.toString(),
      )?.groups;
    if (!results) {
      throw new EGitLabParseError({
        data: {
          url: url.toString(),
          integration: "GitLab",
          cause: "no match",
          process: "repo",
        },
      });
    }
    const { repo } = results;
    if (_.isEmpty(repo)) {
      throw new EGitLabParseError({
        data: {
          url: url.toString(),
          integration: "GitLab",
          cause: "empty match",
          process: "repo",
        },
      });
    }
    return repo;
  },
  getBranch({ url, document }) {
    if (isPR(url)) {
      const branchContainer = document.querySelector(".ref-container");
      if (!branchContainer) {
        throw new EGitLabParseError({
          data: {
            url: url.toString(),
            integration: "GitLab",
            cause: "no match",
            process: "branch",
          },
        });
      }
      const branch = branchContainer.textContent;
      if (!branch || _.isEmpty(branch)) {
        throw new EGitLabParseError({
          data: {
            url: url.toString(),
            integration: "GitLab",
            cause: "empty match",
            process: "branch",
          },
        });
      }
      return branch;
    } else {
      const results =
        /^https?:[/][/][^/]+[/][^/]+[/][^/]+[/]-[/]tree[/](?<branch>[^?]+)/i.exec(
          url.toString(),
        )?.groups;
      if (!results) {
        throw new EGitLabParseError({
          data: {
            url: url.toString(),
            integration: "GitLab",
            cause: "no match",
            process: "branch",
          },
        });
      }
      const { branch } = results;
      if (_.isEmpty(branch)) {
        throw new EGitLabParseError({
          data: {
            url: url.toString(),
            integration: "GitLab",
            cause: "empty match",
            process: "branch",
          },
        });
      }
      return branch;
    }
  },
  buttonClassOverride({ url }) {
    if (isPR(url)) {
      return "ml-2";
    }
  },
};
