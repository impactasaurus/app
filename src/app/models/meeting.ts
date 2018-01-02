import {IAnswer, fragment as aFragment} from './answer';
import {fragment as osFragment, IOutcomeSet} from './outcomeSet';
import {IAggregates, fragment as agFragment} from './aggregates';
import {gql} from 'react-apollo';

export interface IMeeting {
  id: string;
  beneficiary: string;
  user: string;
  outcomeSetID: string;
  outcomeSet?: IOutcomeSet;
  answers: IAnswer[];
  conducted: string;
  created: string;
  modified: string;
  aggregates?: IAggregates;
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

export const fragmentWithOutcomeSetAndAggregates = gql`
  fragment meetingWithOutcomeSetAndAggregates on Meeting {
    ...meetingWithOutcomeSet
    aggregates{
      ...defaultAggregates
    }
  } ${fragmentWithOutcomeSet} ${agFragment}`;

export function sortMeetingsByConducted(meetings: IMeeting[], asc = true): IMeeting[] {
  return meetings.concat().sort((a,b): number => {
    if (asc) {
      return Date.parse(a.conducted) - Date.parse(b.conducted);
    }
    return Date.parse(b.conducted) - Date.parse(a.conducted);
  });
}
