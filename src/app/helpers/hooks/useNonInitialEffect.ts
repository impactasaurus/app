import { useEffect, EffectCallback, DependencyList, useRef } from "react";

/**
 * This hook gets called only when the dependencies change but not during initial render.
 *
 * @param {EffectCallback} effect The `useEffect` callback function.
 * @param {DependencyList} deps An array of dependencies.
 *
 * @example
 * ```
 *  useNonInitialEffect(()=>{
 *      alert("Dependency changed!");
 * },[dependency]);
 * ```
 */
export const useNonInitialEffect = (
  effect: EffectCallback,
  deps?: DependencyList
): void => {
  const initialRender = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let effectReturns: void | (() => void | undefined) = () => {};

    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effectReturns = effect();
    }

    if (effectReturns && typeof effectReturns === "function") {
      return effectReturns;
    }
  }, deps);
};
