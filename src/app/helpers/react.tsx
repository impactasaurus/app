export type ArrayItemRenderer<T> = (T, index: number) => JSX.Element;

export function renderArray<T>(fn: ArrayItemRenderer<T>, arr?: T[]): JSX.Element[] {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }
  return [];
}
