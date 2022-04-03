import { useMemo, DependencyList, useRef } from "react";

/**
 * This hook gets called only when the dependencies change but not during initial render.
 */
export const useNonInitialMemo = <T>(
  factory: () => T,
  initial: T,
  deps?: DependencyList
): T => {
  const initialRender = useRef(true);

  return useMemo(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return initial;
    } else {
      return factory();
    }
  }, deps);
};
