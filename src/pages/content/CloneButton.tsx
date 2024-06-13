import { Button, ButtonLink } from "@lib/components/Button";
import { useTooltip } from "@lib/hooks/useTooltip";
import { getSupportedIntegration } from "@lib/integrations";
import { EIntegrationParseError } from "@lib/integrations/error";
import { clsx } from "@lib/utils/clsx";
import { PortalProps } from "@lib/utils/dom/portal";
import { EError, ENoIntegrationError } from "@lib/utils/error";
import { ModalErrorBoundaryProvider } from "@lib/wrappers/ErrorBoundary";
import { DevPodLogo } from "@src/icons/devpod";
import { StrictMode, useCallback } from "react";
import { createPortal } from "react-dom";
import { useErrorBoundary } from "react-error-boundary";

export function getDevPodUrl(url: string) {
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
    const { hostname, protocol } = new URL(url);

    const branchSuffix = branch ? `@${branch}` : "";
    return `https://devpod.sh/open#${protocol}://${hostname}/${repo}${branchSuffix}`;
  } catch (error) {
    console.error(EError.serialize(error));
    throw error;
  }
}

function CloneButtonInner({
  portal,
  className,
}: PortalProps & { className?: string }) {
  const { isHovering, bindTarget, bindTooltip } =
    useTooltip<HTMLButtonElement>();
  const { showBoundary: showError } = useErrorBoundary();

  const clone = useCallback(() => {
    try {
      const link = getDevPodUrl(window.location.href);
      window.open(link, "_blank", "noreferrer");
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  return (
    <div className="flex justify-center items-center">
      <Button
        onClick={clone}
        color="primary"
        {...bindTarget}
        className={className}
      >
        <DevPodLogo aria-label="" className="w-6 h-6 text-primary-contrast" />{" "}
        DevPod
      </Button>
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
  );
}

export function CloneButton({
  portal,
  className,
}: PortalProps & { className?: string }) {
  return (
    <StrictMode>
      <ModalErrorBoundaryProvider>
        <CloneButtonInner className={className} portal={portal} />
      </ModalErrorBoundaryProvider>
    </StrictMode>
  );
}
