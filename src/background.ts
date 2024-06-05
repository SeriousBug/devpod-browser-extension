import { isSupportedSite } from "@lib/utils/isSupportedSite";
import { UpdateMessage } from "@lib/utils/messages";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

browser.webNavigation.onHistoryStateUpdated.addListener((e) => {
  if (isSupportedSite(e.url)) {
    console.debug("Supported site:", e.url);
    try {
      browser.tabs.sendMessage(e.tabId, {
        type: "devpod-update",
      } satisfies UpdateMessage);
    } catch (error) {
      // This is expected if the tab is not ready to receive messages. It's not
      // a problem if that's the case, because it means the content script has
      // not initialized yet, and thus doesn't need to be updated.
    }
  }
});
