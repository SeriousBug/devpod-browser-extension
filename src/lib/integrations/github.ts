import { WithPartial } from "@lib/utils/typeUtils/WithPartial";
import { Integration } from "./core";
import {
  EIntegrationParseError,
  EIntegrationParseErrorData,
  EIntegrationTargetError,
} from "./error";
import { EErrorOptions } from "@lib/utils/error";
import _ from "lodash";
import { findDOMNodeByContent } from "@lib/utils/dom/findDOMNodeByContent";

type EGithubParseErrorData = EIntegrationParseErrorData & {
  integration: "Github";
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

function isPR(url: string | URL) {
  return /[/](?<repo>[^/]+[/][^/]+)([/]?pull[/](\d+))?/i.test(url.toString());
}

export const Github: Integration = {
  platform: "Github",
  supports(url: string | URL) {
    return /^https?:[/][/]github.com[/][^/]+[/][^/]+/i.test(url.toString());
  },
  getButtonTarget(document: Document) {
    const node =
      findDOMNodeByContent("Code")?.parentElement ??
      document.querySelector<HTMLElement>(".gh-header-actions");
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
  getRepo({ url }) {
    const results =
      /[/](?<repo>[^/]+[/][^/]+)([/]?tree[/](?<branch>[^?]+))?/i.exec(
        url.toString(),
      )?.groups;
    if (!results) {
      throw new EGithubParseError({
        data: {
          url: url.toString(),
          integration: "Github",
          cause: "no match",
          process: "repo",
        },
      });
    }
    const { repo } = results;
    if (_.isEmpty(repo)) {
      throw new EGithubParseError({
        data: {
          url: url.toString(),
          integration: "Github",
          cause: "empty match",
          process: "repo",
        },
      });
    }
    return repo;
  },
  getBranch({ url, document }) {
    if (isPR(url)) {
      const branchContainer = document.querySelector(".commit-ref.head-ref");
      if (!branchContainer) {
        throw new EGithubParseError({
          data: {
            url: url.toString(),
            integration: "Github",
            cause: "no match",
            process: "branch",
          },
        });
      }
      const branch = branchContainer.textContent;
      if (!branch || _.isEmpty(branch)) {
        throw new EGithubParseError({
          data: {
            url: url.toString(),
            integration: "Github",
            cause: "empty match",
            process: "branch",
          },
        });
      }
      return branch;
    } else {
      const results =
        /[/](?<repo>[^/]+[/][^/]+)([/]?tree[/](?<branch>[^?]+))/i.exec(
          url.toString(),
        )?.groups;
      if (!results) {
        throw new EGithubParseError({
          data: {
            url: window.location.href,
            integration: "Github",
            cause: "no match",
            process: "branch",
          },
        });
      }
      const { branch } = results;
      if (_.isEmpty(branch)) {
        throw new EGithubParseError({
          data: {
            url: url.toString(),
            integration: "Github",
            cause: "empty match",
            process: "branch",
          },
        });
      }
      return branch;
    }
  },
};
