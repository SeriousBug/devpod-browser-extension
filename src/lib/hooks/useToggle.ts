import { useCallback, useState } from "react";

export function useToggle(opts: { default?: boolean }) {
  const [isOpen, setIsOpen] = useState(!!opts.default);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
