export type ArrayItemRenderer<T> = (T, idx: number, arr?: T[]) => JSX.Element;

export function renderArray<T>(
  fn: ArrayItemRenderer<T>,
  arr?: T[]
): JSX.Element[] {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }
  return [];
}

export type ArrayItemArrayRenderer<T> = (
  T,
  idx: number,
  arr?: T[]
) => JSX.Element[];

export function renderArrayForArray<T>(
  fn: ArrayItemArrayRenderer<T>,
  arr?: T[]
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
