import { EError, EErrorOptions } from "@lib/utils/error";
import { IntegrationPlatform } from "./core";
import { WithPartial } from "@lib/utils/WithPartial";

type EIntegrationTargetErrorData = {
  url: string;
  integration: IntegrationPlatform;
};
export class EIntegrationTargetError extends EError<EIntegrationTargetErrorData> {
  constructor({
    message = "Unable to find button target",
    data,
  }: WithPartial<EErrorOptions<EIntegrationTargetErrorData>, "message">) {
    super({ message, data });
    this.name = "EIntegrationTargetError";
  }
}

export type EIntegrationParseErrorData = {
  url: string;
  integration: IntegrationPlatform;
  cause: "no match" | "empty match";
  process: "repo" | "branch";
};
export class EIntegrationParseError extends EError<EIntegrationParseErrorData> {
  constructor({
    message = "Unable to extract repository or branch from URL",
    data,
  }: WithPartial<EErrorOptions<EIntegrationParseErrorData>, "message">) {
    super({ message, data });
    this.name = "EIntegrationParseError";
  }
}
