import { IQuestion, fragment as qFragment } from "./question";
import { ICategory, fragment as cFragment } from "./category";
import { gql } from "react-apollo";

export interface IOutcomeSet {
  id: string;
  organisationID: string;
  name: string;
  description: string;
  instructions: string;
  questions: IQuestion[];
  categories: ICategory[];
  readOnly: boolean;
  noteRequired: boolean;
  notePrompt?: string;
}

export const fragment = gql`
  fragment defaultOutcomeSet on OutcomeSet {
    name
    description
    instructions
    noteRequired
    notePrompt
    id
    questions {
      ...defaultQuestion
    }
    categories {
      ...defaultCategory
    }
    readOnly
  }
  ${qFragment}
  ${cFragment}
`;

export interface ICatalogueOS {
  license: string;
  attribution?: string;
  outcomeset: IOutcomeSet;
}

export const catalogueFragment = gql`
  fragment catalogueOutcomeSet on CatalogueOutcomeSet {
    license
    attribution
    outcomeset {
      ...defaultOutcomeSet
    }
  }
  ${fragment}
`;
