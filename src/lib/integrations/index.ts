import { Github } from "./github";
import { GitLab } from "./gitlab";
import { Preview } from "./preview";

const INTEGRATIONS = [Github, GitLab, Preview] as const;

export function getSupportedIntegration(url: string | URL) {
  return INTEGRATIONS.find((integration) => integration.supports(url));
}
