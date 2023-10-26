import { gql } from "react-apollo";
import { IRequiredTag } from "./outcomeSet";

export interface ISequence {
  id: string;
  name: string;
  description?: string;
  questionnaires: {
    id: string;
    name: string;
  }[];
  destination?: string;
  requiredTags: IRequiredTag[];
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
    requiredTags {
      label
      options
    }
  }
`;
