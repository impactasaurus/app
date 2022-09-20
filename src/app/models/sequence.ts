import { gql } from "react-apollo";

export interface ISequence {
  id: string;
  name: string;
  description?: string;
  questionnaires: {
    id: string;
    name: string;
  };
  destination?: string;
}

export const fragment = gql`
  fragment defaultSequence on Sequence {
    id
    name
    description
    questionnaires {
      id
      name
    }
    destination
  }
`;
