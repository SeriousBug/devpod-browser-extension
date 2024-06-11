import { useCallback, useEffect } from "react";
import useSWR from "swr";
import Browser from "webextension-polyfill";

type Key = "modal-dismissed";

type Listener = Parameters<
  typeof Browser.storage.local.onChanged.addListener
>[0];

type StorageParams = {
  /** The key to be inserted into the storage.
   *
   * Should be unique across the app.
   */
  key: Key;
  storageType?: "local" | "sync";
};

function storageKey({ key, storageType }: StorageParams) {
  return `chrome.storage.${storageType}.${key}`;
}

export function useStorage<T = unknown>({
  key,
  storageType = "local",
  validator,
}: {
  validator: (value: unknown) => T | Promise<T>;
} & StorageParams) {
  const {
    data,
    error,
    isValidating,
    mutate: baseMutate,
  } = useSWR(
    storageKey({ key, storageType }),
    async () => {
      const value = await Browser.storage[storageType].get(key);
      return await validator(value);
    },
    {
      suspense: true,
    },
  );

  const mutate = useCallback(async () => {
    await baseMutate();
  }, [baseMutate]);

  const setData = useCallback(
    async (newValue: Awaited<T>) => {
      await Browser.storage[storageType].set({ [key]: newValue });
      await mutate();
    },
    [key, mutate, storageType],
  );

  useEffect(() => {
    const listener: Listener = (changes) => {
      if (key in changes) {
        mutate();
      }
    };
    Browser.storage[storageType].onChanged.addListener(listener);
    return () => {
      Browser.storage[storageType].onChanged.removeListener(listener);
    };
  });

  return {
    isLoading: false,
    data,
    setData,
    error,
    isValidating,
    mutate,
  };
}
