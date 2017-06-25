export type VariableExtractor<T> = (props: T) => {
  [variable: string]: any;
};

export type IDExtractor<T> = (props: T) => string;

export function mutationResultExtractor<T>(mutationName: string): (response: {data: {}}) => Promise<T> {
  return (response) => {
    const result = response.data as any;
    if (result.hasOwnProperty(mutationName)) {
      return Promise.resolve(result[mutationName] as T);
    }
    return Promise.reject(`Unexpected result, no ${mutationName} attribute`);
  };
}
