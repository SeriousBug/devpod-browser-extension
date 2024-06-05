import { useCallback, useEffect } from "react";
import useSWR from "swr";

type Key = "prompts";

type Listener = Parameters<
  typeof chrome.storage.local.onChanged.addListener
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
      const value = await chrome.storage[storageType].get(key);
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
      await chrome.storage[storageType].set({ [key]: newValue });
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
    chrome.storage[storageType].onChanged.addListener(listener);
    return () => {
      chrome.storage[storageType].onChanged.removeListener(listener);
    };
  });

  if (!data && !error) {
    return {
      isLoading: true,
      data: undefined,
      setData,
      error: undefined,
      isValidating,
      mutate,
    };
  }

  return {
    isLoading: false,
    data,
    setData,
    error,
    isValidating,
    mutate,
  };
}
