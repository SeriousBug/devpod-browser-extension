import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { EError } from "../utils/error";
import { Modal } from "@lib/components/Modal";
import { Button } from "@lib/components/Button";

function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const errorEncoded = EError.encode(error);

  return (
    <Modal
      isOpen
      onClose={resetErrorBoundary}
      className="text-text flex flex-col gap-4 max-w-[80vw] lg:max-w-2xl"
    >
      <h2 className="font-bold text-xl">{EError.message(error)}</h2>
      <p>
        Please send the following code along with a description of what you were
        trying to do when the error happened via email to{" "}
        <a href="mailto:open-devpod-browser-extension.error@mail.bgenc.net">
          open-devpod-browser-extension.error@mail.bgenc.net
        </a>
        or by creating an issue on our GitHub repository at{" "}
        <a href="https://github.com/SeriousBug/open-devpod-browser-extension/issues/new">
          github.com/SeriousBug/open-devpod-browser-extension
        </a>
      </p>
      <div className="w-full relative">
        <pre
          id="error-code"
          className="overflow-clip m-4 p-4 bg-text bg-opacity-10"
        >
          {errorEncoded}
        </pre>
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-r from-60% from-transparent to-background pointer-events-none"></div>
        <Button
          className="absolute right-6 top-6"
          variant="solid"
          onClick={() => {
            navigator.clipboard.writeText(errorEncoded);
          }}
        >
          Copy
        </Button>
      </div>
      <details className="flex flex-col gap-4">
        <summary>What&apos;s in this?</summary>
        <p>
          This error code contains information to help us diagnose the problem.
          It will include the URL of the current web page you are on, and
          information about the state of the extension. It does not contain your
          username, password, or any personal information. It does not give us
          or anyone else access to your account. You can review the data below.
        </p>
        <pre className="bg-text bg-opacity-10 p-4 m-4 overflow-auto">
          {JSON.stringify(EError.serialize(error), null, 2)}
        </pre>
      </details>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Retry
      </Button>
    </Modal>
  );
}

export function ErrorBoundaryProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallbackRender}>{children}</ErrorBoundary>
  );
}
