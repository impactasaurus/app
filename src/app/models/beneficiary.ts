import { gql } from "react-apollo";

export interface IBeneficiary {
  ID: string;
  tags: string[];
}

export const fragment = gql`
  fragment defaultBeneficiary on Beneficiary {
    id
    tags
  }
`;
