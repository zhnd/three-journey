import { useEffect, useMemo, useState } from "react";

export type UseMeasureRect = Pick<
  DOMRectReadOnly,
  "x" | "y" | "top" | "left" | "right" | "bottom" | "height" | "width"
>;
export type UseMeasureRef<E extends Element = Element> = (element: E) => void;
export type UseMeasureResult<E extends Element = Element> = [
  UseMeasureRef<E>,
  UseMeasureRect
];

const defaultState: UseMeasureRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const useParentElementMeasure = (childRef: React.RefObject<HTMLElement>) => {
  const [rect, setRect] = useState<UseMeasureRect>(defaultState);
  const observer = useMemo(() => {
    if (typeof window === "undefined") return;
    return new ResizeObserver((entries) => {
      if (entries[0]) {
        const { x, y, width, height, top, left, bottom, right } =
          entries[0].contentRect;
        setRect({ x, y, width, height, top, left, bottom, right });
      }
    });
  }, []);

  useEffect(() => {
    const parentElement = childRef?.current?.parentElement;

    if (parentElement && observer) {
      observer.observe(parentElement);
    }

    return () => {
      observer?.disconnect();
    };
  }, [observer, childRef]);

  return { rect };
};

export default useParentElementMeasure;
