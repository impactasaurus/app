export type VariableExtractor<T> = (props: T) => {
  [variable: string]: any;
};

export type IDExtractor<T> = (props: T) => string;
