import { gql } from "react-apollo";

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  aggregation: string;
}

export const fragment = gql`
  fragment defaultCategory on Category {
    id
    name
    description
    aggregation
  }
`;
