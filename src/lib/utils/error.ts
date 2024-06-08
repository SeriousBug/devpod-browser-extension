import { WithPartial } from "./typeUtils/WithPartial";
import { safeStringify } from "./safeStringify";

export type EErrorOptions<T = unknown> = {
  /** Human readable message, may be displayed to end users. */
  message: string;
  /** Any data to be included with the error. */
  data?: T;
  /** For wrapped errors, the original cause of the error. */
  cause?: unknown;
};

export class EError<T = unknown> extends Error {
  private _data?: T;
  public get data(): Readonly<T> | undefined {
    return this._data;
  }

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
  public static serialize(error: unknown): unknown {
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
    return btoa(safeStringify(this.serialize(error)));
  }
}

type ENoIntegrationErrorData = {
  url: string;
};
export class ENoIntegrationError extends EError<ENoIntegrationErrorData> {
  constructor({
    message = "No integration found for this site.",
    data,
  }: WithPartial<EErrorOptions<ENoIntegrationErrorData>, "message">) {
    super({ message, data });
    this.name = "ENoIntegrationError";
  }
}
