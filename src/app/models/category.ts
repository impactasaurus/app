import gql from 'graphql-tag';

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  aggregation: string;
}

export const fragment = gql`
  fragment defaultCategory on Category {
    id,
    name,
    description,
    aggregation
  }
`;
