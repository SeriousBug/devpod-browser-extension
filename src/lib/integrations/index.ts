import { Github } from "./github";
import { GitLab } from "./gitlab";

const INTEGRATIONS = [Github, GitLab] as const;

export function getSupportedIntegration(url: string | URL) {
  return INTEGRATIONS.find((integration) => integration.supports(url));
}
