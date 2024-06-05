import { WithPartial } from "./WithPartial";
import { safeStringify } from "./safeStringify";

type EErrorOptions<T = unknown> = {
  /** Human readable message, may be displayed to end users. */
  message: string;
  /** Any data to be included with the error. */
  data?: T;
  /** For wrapped errors, the original cause of the error. */
  cause?: unknown;
};

export class EError<T = unknown> extends Error {
  private _data?: T;

  constructor({ message, data, cause }: EErrorOptions<T>) {
    super(message, { cause });
    this.name = "EError";
    this._data = data;
  }

  public static name(error: unknown) {
    return error instanceof Error ? error.name : "UnknownError";
  }
  public static message(error: unknown) {
    return error instanceof Error ? error.message : "An unknown error occurred";
  }

  /** Convert an error into an object, recursively serializing causes as needed. */
  private static serialize(error: unknown): unknown {
    // Wrapping the recursion in this inner function to hide the recursion parameter
    function serializeRecurse(error: unknown, recursion: number): unknown {
      if (error === undefined || error === null) {
        return undefined;
      }

      const cause =
        error instanceof Error && recursion > 0 && error.cause
          ? serializeRecurse(error.cause, recursion - 1)
          : undefined;
      const name = EError.name(error);
      const message = EError.message(error);

      if (error instanceof EError) {
        return {
          name,
          message,
          data: error._data,
          stack: error.stack,
          cause,
        };
      }

      if (error instanceof Error) {
        return {
          name,
          message,
          stack: error.stack,
          cause,
        };
      }

      return {
        name,
        message,
        data: safeStringify(error),
      };
    }
    return serializeRecurse(error, 10);
  }

  public static encode(error: unknown): string {
    return Buffer.from(safeStringify(this.serialize(error))).toString(
      "base64url",
    );
  }
}

type EShadowErrorData = {
  selector: { content: string };
};
export class EShadowError extends EError<EShadowErrorData> {
  constructor({
    message = "open-devpod-browser-extension is unable to attach an element to the page.",
    data,
  }: WithPartial<EErrorOptions<EShadowErrorData>, "message">) {
    super({ message, data });
    this.name = "EShadowError";
  }
}
