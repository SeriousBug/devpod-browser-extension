import { Integration } from "./core";

/** A dummy integration just for testing and development.
 *
 * This is always supported on every page in preview mode, and never on production.
 */
export const Preview: Integration = {
  platform: "Github",
  supports() {
    console.log("PREVIEW", PREVIEW);
    return !!PREVIEW;
  },
  getButtonTarget(document: Document) {
    return document.body;
  },
  getRepo({ url }) {
    const u = new URL(url);
    if (u.searchParams.has("repo")) {
      return u.searchParams.get("repo")!;
    }
    return "github/choosealicense.com";
  },
  getBranch({ url }) {
    const u = new URL(url);
    if (u.searchParams.has("branch")) {
      return u.searchParams.get("branch")!;
    }
    return "spdx-license-templates";
  },
};
