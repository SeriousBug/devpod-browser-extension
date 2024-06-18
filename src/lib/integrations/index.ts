import { Github } from "./github";
import { GitLab } from "./gitlab";
import { Preview } from "./preview";
import { Sourcehut } from "./sourcehut";

const INTEGRATIONS = [Github, GitLab, Sourcehut, Preview] as const;

export function getSupportedIntegration(url: string | URL) {
  return INTEGRATIONS.find((integration) =>
    integration.supports(typeof url === "string" ? new URL(url) : url),
  );
}
