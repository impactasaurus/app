export type VariableExtractor<T> = (props: T) => {
  [variable: string]: any;
};

export type IDExtractor<T> = (props: T) => string;
export type Extractor<T, R> = (props: T) => R;

export function mutationResultExtractor<T>(
  mutationName: string
): (response: { data: unknown }) => Promise<T> {
  return (response) => {
    const result = response.data;
    if (Object.prototype.hasOwnProperty.call(result, mutationName)) {
      return Promise.resolve(result[mutationName] as T);
    }
    return Promise.reject(`Unexpected result, no ${mutationName} attribute`);
  };
}
