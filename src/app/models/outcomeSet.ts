import {IQuestion, fragment as qFragment} from './question';
import {gql} from 'react-apollo';

export interface IOutcomeSet {
  id: string;
  organisationID: string;
  name: string;
  description: string;
  questions: IQuestion[];
}

export const fragment = gql`
  fragment defaultOutcomeSet on OutcomeSet {
    name,
    description,
    id,
    questions {
      ...defaultQuestion
    }
  }
  ${qFragment}`;
