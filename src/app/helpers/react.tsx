export type ArrayItemRenderer<T> = (T, idx: number, arr?: T[]) => JSX.Element;

export function renderArray<T>(
  fn: ArrayItemRenderer<T>,
  arr: T[],
  emptyList?: JSX.Element
): JSX.Element[] {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map(fn);
  }
  return emptyList ? [emptyList] : [];
}

export type ArrayItemArrayRenderer<T> = (
  T,
  idx: number,
  arr?: T[]
) => JSX.Element[];

export function renderArrayForArray<T>(
  fn: ArrayItemArrayRenderer<T>,
  arr: T[]
): JSX.Element[] {
  if (Array.isArray(arr)) {
    return arr.reduce<JSX.Element[]>(
      (elements: JSX.Element[], current: T, idx: number): JSX.Element[] => {
        return elements.concat(...fn(current, idx, arr));
      },
      []
    );
  }
  return [];
}
