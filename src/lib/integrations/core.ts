export type IntegrationPlatform = "Github" | "GitLab" | "sourcehut";

export type Integration = {
  platform: IntegrationPlatform;
  supports(url: URL): boolean;
  getButtonTarget(document: Document): HTMLElement;
  getCloneUrl(params: { url: URL; document: Document }): string | undefined;
  /** If given, these additional classes will be applied to the Clone with DevPod button. */
  buttonClassOverride?: (params: {
    url: URL | Location;
    document: Document;
  }) => string | undefined;
  buttonContainerOverride?: (params: {
    url: URL | Location;
    document: Document;
  }) => string | undefined;
};
