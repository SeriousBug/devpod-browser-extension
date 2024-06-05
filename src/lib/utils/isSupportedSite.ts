export function isSupportedSite(url: string) {
  return /^https?:[/][/]github.com[/][^/]+[/][^/]+/.test(url);
}
