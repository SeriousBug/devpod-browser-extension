import { z } from "zod";
import { useStorage } from "../useStorage";
import { useCallback } from "react";

const ModalKey = z.literal("error-boundary");
export type ModalKey = z.infer<typeof ModalKey>;

const ModalDismissed = z.record(
  ModalKey,
  z.object({
    at: z.coerce.date(),
    duration: z.literal("permanent"),
  }),
);
type ModalDismissed = z.infer<typeof ModalDismissed>;

/** Keeps track of whether a modal has been dismissed or not. */
export function useModalDismissed<Dismissable extends boolean>({
  key,
}: {
  /** Set to a key to make the modal dismissable, or undefined if the modal is not dismissable. */
  key: Dismissable extends true ? ModalKey : undefined;
}):
  | {
      dismissable: true;
      isDismissed: boolean;
      error: unknown;
      mutate: () => void;
      dismiss: () => void;
      restore: () => void;
    }
  | {
      dismissable: false;
      isDismissed: false;
    } {
  const { data, error, setData, mutate } = useStorage({
    key: "modal-dismissed",
    validator: ModalDismissed.parseAsync,
    storageType: "local",
  });

  const dismiss = useCallback(() => {
    if (!key) return;
    return setData({ [key]: { at: new Date(), duration: "permanent" } });
  }, [setData, key]);
  const restore = useCallback(() => {
    if (!key) return;
    return setData({ [key]: undefined });
  }, [setData, key]);

  if (!key) {
    return {
      dismissable: false,
      isDismissed: false,
    };
  }

  return {
    dismissable: true,
    isDismissed: data[key] !== undefined,
    error,
    mutate,
    dismiss,
    restore,
  };
}
