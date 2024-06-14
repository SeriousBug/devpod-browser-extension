import { getSupportedIntegration } from "@lib/integrations";
import { UpdateMessage } from "@lib/utils/messages";
import { trace } from "@opentelemetry/api";
import { ulid } from "ulidx";
import browser from "webextension-polyfill";
import { z } from "zod";
import { setupObservability, span } from "./background/telemetry";

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

browser.webNavigation.onHistoryStateUpdated.addListener((e) => {
  const integration = getSupportedIntegration(e.url);
  if (integration) {
    console.debug("Supported site:", {
      url: e.url,
      platform: integration.platform,
    });
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
