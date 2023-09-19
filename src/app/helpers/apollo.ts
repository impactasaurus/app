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

export const sanitiseGraphQLError = (err: string): string => {
  const filtered = err.replace("GraphQL error: ", "");
  return filtered.length > 0
    ? filtered[0].toUpperCase() + filtered.substring(1)
    : filtered;
};

// taken from apollo-client library as it wasn't exposed
export const defaultDataIdFromObject = (
  result: Record<string, unknown>
): string | null => {
  if (result.__typename) {
    if (result.id !== undefined) {
      return result.__typename + ":" + result.id;
    }
    if (result._id !== undefined) {
      return result.__typename + ":" + result._id;
    }
  }
  return null;
};
