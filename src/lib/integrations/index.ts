import { github } from "./github";

const INTEGRATIONS = [github] as const;

export function getSupportedIntegration(url: string | URL) {
  return INTEGRATIONS.find((integration) => integration.supports(url));
}
