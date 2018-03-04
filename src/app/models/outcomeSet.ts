import {IQuestion, fragment as qFragment} from './question';
import {ICategory, fragment as cFragment} from './category';
import gql from 'graphql-tag';

export interface IOutcomeSet {
  id: string;
  organisationID: string;
  name: string;
  description: string;
  questions: IQuestion[];
  categories: ICategory[];
}

export const fragment = gql`
  fragment defaultOutcomeSet on OutcomeSet {
    name,
    description,
    id,
    questions {
      ...defaultQuestion
    }
    categories {
      ...defaultCategory
    }
  }
  ${qFragment} ${cFragment}`;
