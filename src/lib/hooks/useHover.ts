import { useCallback, useState } from "react";

export function useHover(opts?: { onHover?: () => void }) {
  const [isHovering, setIsHovering] = useState(false);

  return {
    isHovering,
    bindHover: {
      onMouseEnter: useCallback(() => {
        opts?.onHover?.();
        setIsHovering(true);
      }, [opts]),
      onMouseLeave: useCallback(() => setIsHovering(false), []),
    },
  };
}
