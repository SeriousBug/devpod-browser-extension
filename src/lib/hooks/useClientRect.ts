import _ from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

/** Get the client rect of an HTML element.
 *
 * Assign the returned `ref` to the element you want to measure. The `position`
 * object will be updated whenever the element's size or position changes.
 * Probably.
 *
 * If you already have a ref you're using for something else, you can call
 * {@link useClientRectForRef} directly instead.
 */
export function useClientRect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return useClientRectForRef({ ref });
}

const DEFAULT_POSITION: DOMRect = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  toJSON: () => JSON.stringify(undefined),
};

/** Get the client rect of an HTML element.
 *
 * Assign the returned `ref` to the element you want to measure. The `position`
 * object will be updated whenever the element's size or position changes.
 * Probably.
 */
export function useClientRectForRef<T extends HTMLElement>({
  ref,
}: {
  ref: RefObject<T>;
}) {
  const [position, setPosition] = useState<DOMRect>(DEFAULT_POSITION);

  const updatePositionByRef = useCallback(() => {
    const newRect = ref?.current?.getBoundingClientRect();
    if (newRect)
      setPosition((prevRect) => {
        return !_.isEqual(prevRect, newRect) ? newRect : prevRect;
      });
  }, [ref]);

  useEffect(() => {
    updatePositionByRef();

    const update = _.debounce(updatePositionByRef, 100);
    addEventListener("resize", update);
    return () => {
      removeEventListener("resize", update);
    };
  }, [ref, updatePositionByRef]);

  return { position, ref, forceUpdate: updatePositionByRef };
}
