import { createRoot } from "react-dom/client";
import styles from "../tailwind.css?inline";
import { createPortal } from "react-dom";
import { useTooltip } from "@lib/hooks/useTooltip";
import { ErrorBoundaryProvider } from "@lib/wrappers/ErrorBoundary";
import { clsx } from "@lib/utils/clsx";
import { EError, EShadowError } from "@lib/utils/error";
import { DevPodLogoIcon } from "@src/icons/devpod";
import { StrictMode } from "react";
import { ButtonLink } from "@lib/components/Button";
import { runtime } from "webextension-polyfill";
import { UpdateMessage } from "@lib/utils/messages";

type PortalProps = { portal: HTMLElement | DocumentFragment };

function getDevPodUrl() {
  try {
    let branch;
    // https://github.com/SeriousBug/selidor/pull/6
    if (
      /[/](?<repo>[^/]+[/][^/]+)([/]?pull[/](\d+))?/.test(
        window.location.pathname,
      )
    ) {
      // Pull request
      branch = document.querySelector(".commit-ref.head-ref")?.textContent;
    }

    const results =
      /[/](?<repo>[^/]+[/][^/]+)([/]?tree[/](?<branch>[^?]+))?/.exec(
        window.location.pathname,
      )?.groups;
    if (!results) {
      throw new EError({
        message: "Unable to extract repository and branch from URL",
        data: { url: window.location.href },
      });
    }
    const { repo } = results;
    if (!branch) {
      branch = results.branch as string | undefined;
    }

    if (!repo) {
      throw new EError({
        message: "Repository not found in URL",
        data: { url: window.location.href, repo, branch },
      });
    }

    const branchSuffix = branch ? `@${branch}` : "";
    return `https://devpod.sh/open#https://github.com/${repo}${branchSuffix}`;
  } catch (error) {
    console.error(error);
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

function findDOMNodeByContent(content: string) {
  for (const node of document.querySelectorAll("button")) {
    if (node.textContent?.includes(content)) {
      console.debug("Found node", node);
      return node;
    }
  }
}

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
    const buttonTarget =
      findDOMNodeByContent("Code")?.parentElement ??
      document.querySelector(".gh-header-actions");
    const { shadow: rootContainer, target: rootContainerTarget } =
      attachShadow(buttonTarget);
    buttonContainer = rootContainerTarget;
    const root = createRoot(rootContainer);
    const { shadow: portalContainer } = attachShadow(document.body);
    root.render(<Control portal={portalContainer} />);
  } catch (error) {
    console.debug("Initialization failed", error);
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
