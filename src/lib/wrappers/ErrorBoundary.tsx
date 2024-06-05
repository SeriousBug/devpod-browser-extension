import { ReactNode, useMemo } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { EError } from "../utils/error";

function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const errorEncoded = useMemo(() => EError.encode(error), [error]);

  return (
    <div role="alert">
      <p>{EError.message(error)}</p>
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
      <pre>{errorEncoded}</pre>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

export function ErrorBoundaryProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={FallbackRender}>{children}</ErrorBoundary>
  );
}
