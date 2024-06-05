import { useMemo } from "react";
import { useClientRect } from "./useClientRect";
import { useHover } from "./useHover";

export function useTooltip<T extends HTMLElement>() {
  const { ref, position, forceUpdate } = useClientRect<T>();
  const { isHovering, bindHover } = useHover({ onHover: forceUpdate });

  const bindTooltip = useMemo(
    () => ({
      ...bindHover,
      style: {
        left: position.left - position.width,
        top: position.bottom,
      },
    }),
    [bindHover, position],
  );

  const bindTarget = useMemo(
    () => ({
      ref,
      ...bindHover,
    }),
    [ref, bindHover],
  );

  return { isHovering, bindTarget, bindTooltip };
}
