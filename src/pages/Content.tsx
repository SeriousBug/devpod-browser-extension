import { createRoot } from "react-dom/client";
import { EError, ENoIntegrationError } from "@lib/utils/error";
import { runtime } from "webextension-polyfill";
import { UpdateMessage } from "@lib/utils/messages";
import { getSupportedIntegration } from "@lib/integrations";
import { attachShadow } from "@lib/utils/dom/shadow";
import { CloneButton } from "./content/CloneButton";
import _ from "lodash";

const MAX_INIT_ATTEMPTS = 12;

let buttonContainer: HTMLDivElement | null = null;

const debouncedInit = _.debounce(() => init(), 250);

function isElementVisible(el: HTMLElement) {
  return el.offsetWidth > 0 && el.offsetHeight > 0;
}

function init(attempts: number = 0) {
  if (attempts > MAX_INIT_ATTEMPTS) {
    // Too many attempts, aborting
    return;
  }
  if (buttonContainer && document.contains(buttonContainer)) {
    // Already initialized
    if (!isElementVisible(buttonContainer)) {
      // Button is no longer visible, try to move it to a new visible location
      const integration = getSupportedIntegration(window.location.href);
      const buttonTarget = integration?.getButtonTarget(document);
      buttonTarget?.appendChild(buttonContainer);
    }
    return;
  }
  try {
    const integration = getSupportedIntegration(window.location.href);
    if (!integration) {
      throw new ENoIntegrationError({ data: { url: window.location.href } });
    }

    const buttonTarget = integration.getButtonTarget(document);
    const { shadow: rootContainer, target: rootContainerTarget } =
      attachShadow(buttonTarget);
    buttonContainer = rootContainerTarget;
    const root = createRoot(rootContainer);
    const { shadow: portalContainer } = attachShadow(document.body);
    root.render(
      <CloneButton
        className={integration.buttonClassOverride?.({
          url: window.location,
          document,
        })}
        containerClassName={integration.buttonContainerOverride?.({
          url: window.location,
          document,
        })}
        portal={portalContainer}
      />,
    );

    // Try to catch if the button gets removed dynamically and reinitialize
    const observer = new MutationObserver(debouncedInit);
    observer.observe(buttonTarget, {
      childList: true,
      subtree: true,
    });
    window.removeEventListener("focus", debouncedInit);
    window.addEventListener("focus", debouncedInit);
  } catch (error) {
    if (error instanceof ENoIntegrationError) {
      // Ignore, expected error when the site is not supported.
      console.debug("No integration found for this site");
    } else {
      console.info("Initialization failed", {
        attempts,
        error: EError.serialize(error),
      });
    }
    // 10ms, 20ms, 40ms, 80ms, 160ms, 320ms, 640ms, 1280ms, 2560ms, 5120ms, 10240ms, 20480ms
    setTimeout(() => init(attempts + 1), Math.pow(2, attempts) * 10);
  }
}

console.debug("Initializing DevPod button");
init();
runtime.onMessage.addListener((message) => {
  UpdateMessage.safeParseAsync(message).then(async (result) => {
    if (!result.success) return;
    const message = result.data;
    console.debug(`Received message ${message.type}`);
    if (message.type === "devpod-update") {
      init();
    }
  });
});
