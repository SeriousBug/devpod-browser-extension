import { ReactNode, useCallback, useMemo, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { EError } from "../utils/error";
import { Modal } from "@lib/components/Modal";
import { Button, Link } from "@lib/components/Button";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const { errorEncoded, message, serialized } = useMemo(() => {
    return {
      errorEncoded: EError.encode(error),
      message: EError.message(error),
      serialized: EError.stringify(error, 2),
    };
  }, [error]);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(errorEncoded);
  }, [errorEncoded]);
  const [dismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  return (
    <Modal
      isOpen={!dismissed}
      onClose={dismiss}
      className="text-text flex flex-col gap-4 max-w-[80vw] lg:max-w-2xl z-50"
    >
      <div className="flex flex-row w-full justify-between">
        <h2 className="font-bold text-xl">Error: {message}</h2>
        <Button variant="outline" onClick={dismiss}>
          X
        </Button>
      </div>
      <p>
        Please send the following code along with a description of what you were
        trying to do when the error happened via email to{" "}
        <Link className="inline" href="mailto:devpod-ext@mail.bgenc.net">
          devpod-ext@mail.bgenc.net
        </Link>{" "}
        or by creating an issue on our GitHub repository at{" "}
        <Link
          className="inline"
          href="https://github.com/SeriousBug/devpod-ext/issues/new"
        >
          github.com/SeriousBug/devpod-ext
        </Link>
        .
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
          onClick={onCopy}
        >
          Copy
        </Button>
      </div>
      <details className="flex flex-col gap-4">
        {/*
         * Making a custom details button by hiding the marker,
         * sizing the summary box to fit the button, then making
         * the button click-through so you can click the summary
         * box. All of this butchers accessibility, so we'll hide
         * the button and just give a text label for screen readers.
         */}
        <summary
          aria-label="What's in this?"
          className="marker:content-none w-fit cursor-pointer"
        >
          <Button aria-hidden className="pointer-events-none">
            What&apos;s this error code?
          </Button>
        </summary>
        <p>
          This error code contains information to help us diagnose the problem.
          It may include an obfuscated address of the current web page you are
          on, the version of the extension and browser, and the state of the
          extension. It does not contain your username, password, or any
          personal information. It does not give us or anyone else access to
          your account. You can review the data below.
        </p>
        <pre className="bg-text bg-opacity-10 p-4 m-4 overflow-auto">
          {serialized}
        </pre>
      </details>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Retry
      </Button>
    </Modal>
  );
}

export function ErrorBoundaryProvider({ children }: { children: ReactNode }) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
}
