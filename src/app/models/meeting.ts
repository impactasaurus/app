import {IAnswer, fragment as aFragment} from './answer';
import {fragment as osFragment, IOutcomeSet} from './outcomeSet';
import {gql} from 'react-apollo';

export interface IMeeting {
  id: string;
  beneficiary: string;
  user: string;
  outcomeSetID: string;
  outcomeSet?: IOutcomeSet;
  answers: IAnswer[];
  conducted: Date;
  created: Date;
  modified: Date;
}

export const fragment = gql`
  fragment defaultMeeting on Meeting {
    id,
    beneficiary,
    user,
    outcomeSetID,
    answers {
      ...defaultAnswer
    },
    conducted,
    created,
    modified
  } ${aFragment}`;

export const fragmentWithOutcomeSet = gql`
  fragment meetingWithOutcomeSet on Meeting {
    ...defaultMeeting
    outcomeSet {
      ...defaultOutcomeSet
    }
  } ${fragment} ${osFragment}`;
