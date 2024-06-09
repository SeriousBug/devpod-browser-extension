export type IntegrationPlatform = "Github" | "GitLab";

export type Integration = {
  platform: IntegrationPlatform;
  supports(url: string | URL): boolean;
  getButtonTarget(document: Document): HTMLElement;
  getRepo(params: { url: string | URL; document: Document }): string;
  getBranch(params: { url: string | URL; document: Document }): string;
  /** If given, these additional classes will be applied to the Clone with DevPod button. */
  buttonClassOverride?: (params: {
    url: string | URL;
    document: Document;
  }) => string | undefined;
};
