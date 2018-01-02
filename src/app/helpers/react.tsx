export type ArrayItemRenderer<T> = (T, idx: number, arr?: T[]) => JSX.Element;

export function renderArray<T>(fn: ArrayItemRenderer<T>, arr?: T[]): JSX.Element[] {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }
  return [];
}
