import { createRoot } from "react-dom/client";
import styles from "../tailwind.css?inline";
import { createPortal } from "react-dom";
import { useTooltip } from "@lib/hooks/useTooltip";
import { ErrorBoundaryProvider } from "@lib/wrappers/ErrorBoundary";
import { clsx } from "@lib/utils/clsx";
import { EError, ENoIntegrationError, EShadowError } from "@lib/utils/error";
import { DevPodLogoIcon } from "@src/icons/devpod";
import { StrictMode } from "react";
import { ButtonLink } from "@lib/components/Button";
import { runtime } from "webextension-polyfill";
import { UpdateMessage } from "@lib/utils/messages";
import { getSupportedIntegration } from "@lib/integrations";
import { EIntegrationParseError } from "@lib/integrations/error";

type PortalProps = { portal: HTMLElement | DocumentFragment };

function getDevPodUrl() {
  const url = window.location.href;
  try {
    const integration = getSupportedIntegration(url);
    if (!integration) {
      throw new ENoIntegrationError({ data: { url } });
    }
    const repo = integration.getRepo({ url, document });
    let branch;
    try {
      branch = integration.getBranch({ url, document });
    } catch (error) {
      if (
        // "no match" errors are expected when we're on the main branch
        !(error instanceof EIntegrationParseError) ||
        error.data?.cause !== "no match"
      ) {
        throw error;
      }
    }

    const branchSuffix = branch ? `@${branch}` : "";
    return `https://devpod.sh/open#https://github.com/${repo}${branchSuffix}`;
  } catch (error) {
    console.error(EError.serialize(error));
    throw error;
  }
}

export function Control({ portal }: PortalProps) {
  const { isHovering, bindTarget, bindTooltip } =
    useTooltip<HTMLAnchorElement>();

  return (
    <StrictMode>
      <div className="flex justify-center items-center">
        <ErrorBoundaryProvider>
          <ButtonLink
            rel="noreferrer"
            target="_blank"
            href={getDevPodUrl()}
            color="primary"
            {...bindTarget}
          >
            <DevPodLogoIcon
              aria-label=""
              className="w-6 h-6 text-primary-contrast"
            />{" "}
            DevPod
          </ButtonLink>
        </ErrorBoundaryProvider>
        {createPortal(
          <div
            className={clsx(
              "absolute z-10 bg-gray-800 text-white p-2 rounded-lg transition-opacity duration-200 pointer-events-none cursor-default text-xs",
              isHovering ? "opacity-100" : "opacity-0",
            )}
            {...bindTooltip}
          >
            Clone with DevPod
          </div>,
          portal,
        )}
      </div>
    </StrictMode>
  );
}

function attachStyles(target: HTMLElement | DocumentFragment) {
  const style = document.createElement("style");
  style.innerHTML = styles;
  target.appendChild(style);
}

function attachShadow<E extends Element = Element>(target: E | null) {
  if (!target) {
    throw new EShadowError({});
  }
  const shadowTarget = document.createElement("div");
  target.appendChild(shadowTarget);
  const shadow = shadowTarget.attachShadow({ mode: "closed" });
  attachStyles(shadow);
  return { shadow, target: shadowTarget };
}

const MAX_INIT_ATTEMPTS = 12;

let buttonContainer: HTMLDivElement | null = null;

function init(attempts: number = 0) {
  if (attempts > MAX_INIT_ATTEMPTS) {
    // Too many attempts, aborting
    return;
  }
  if (document.contains(buttonContainer)) {
    // ALready initialized
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
    root.render(<Control portal={portalContainer} />);
  } catch (error) {
    if (error instanceof ENoIntegrationError) {
      // Ignore, expected error when the site is not supported.
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
