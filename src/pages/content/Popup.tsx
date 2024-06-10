import { ButtonLink } from "@lib/components/Button";
import Browser from "webextension-polyfill";
import { getDevPodUrl } from "./CloneButton";
import useSWR from "swr";
import { InlineErrorBoundaryProvider } from "@lib/wrappers/ErrorBoundary";
import { ENoIntegrationError } from "@lib/utils/error";

function PopupInner() {
  const { data, error } = useSWR(
    "devpod-url",
    async () => {
      const [activeTab] = await Browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!activeTab || !activeTab.url) return;
      return getDevPodUrl(activeTab.url);
    },
    { suspense: false /* todo */ },
  );

  if (error && error instanceof ENoIntegrationError) {
    return (
      <div className="p-8">
        <p className="w-48">
          This extension does not support this website yet! Currently, only
          Github and GitLab are supported. Please check back soon for more
          platforms to be supported.
        </p>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <div className="p-8">
      <ButtonLink
        target="_blank"
        referrerPolicy="no-referrer"
        variant="solid"
        href={data!}
      >
        {!data ? "Loading..." : "Clone in DevPod"}
      </ButtonLink>
    </div>
  );
}

export function Popup() {
  return (
    <InlineErrorBoundaryProvider>
      <PopupInner />
    </InlineErrorBoundaryProvider>
  );
}
