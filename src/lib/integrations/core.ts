export type IntegrationPlatform = "github";

export type Integration = {
  platform: IntegrationPlatform;
  supports(url: string | URL): boolean;
  getButtonTarget(document: Document): HTMLElement;
  getRepo(params: { url: string | URL; document: Document }): string;
  getBranch(params: { url: string | URL; document: Document }): string;
};
