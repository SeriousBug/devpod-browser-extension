import { z } from "zod";
import { useStorage } from "../useStorage";
import { useCallback } from "react";

const ModalKey = z.literal("error-boundary");
type ModalKey = z.infer<typeof ModalKey>;

const ModalDismissed = z.record(
  ModalKey,
  z.object({
    at: z.coerce.date(),
    duration: z.literal("permanent"),
  }),
);
type ModalDismissed = z.infer<typeof ModalDismissed>;

export function useModalDismissed({ key }: { key: ModalKey }) {
  const { data, error, setData, mutate, isLoading } = useStorage({
    key: "modal-dismissed",
    validator: ModalDismissed.parseAsync,
    storageType: "local",
  });

  const dismiss = useCallback(() => {
    return setData({ [key]: { at: new Date(), duration: "permanent" } });
  }, [setData, key]);
  const restore = useCallback(() => {
    return setData({ [key]: undefined });
  }, [setData, key]);

  return {
    isLoading,
    isDismissed: data?.[key] !== undefined,
    error,
    mutate,
    dismiss,
    restore,
  };
}
