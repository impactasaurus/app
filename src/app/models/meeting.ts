import { IAnswer, fragment as aFragment } from "./answer";
import { fragment as osFragment, IOutcomeSet } from "./outcomeSet";
import { IAggregates, fragment as agFragment } from "./aggregates";
import { gql } from "react-apollo";

export interface IMeeting {
  id: string;
  beneficiary: string;
  user: string;
  outcomeSetID: string;
  outcomeSet?: IOutcomeSet;
  answers: IAnswer[];
  created: string;
  date?: string;
  aggregates?: IAggregates;
  tags?: string[];
  benTags?: string[];
  meetingTags?: string[];
  incomplete: boolean;
  notes?: string;
}

export const fragment = gql`
  fragment defaultMeeting on Meeting {
    id
    beneficiary
    user
    outcomeSetID
    answers {
      ...defaultAnswer
    }
    created
    date
    incomplete
    tags
    benTags
    meetingTags
    notes
  }
  ${aFragment}
`;

export const fragmentWithOutcomeSet = gql`
  fragment meetingWithOutcomeSet on Meeting {
    ...defaultMeeting
    outcomeSet {
      ...defaultOutcomeSet
    }
  }
  ${fragment}
  ${osFragment}
`;

export const fragmentWithOutcomeSetAndAggregates = gql`
  fragment meetingWithOutcomeSetAndAggregates on Meeting {
    ...meetingWithOutcomeSet
    aggregates {
      ...defaultAggregates
    }
  }
  ${fragmentWithOutcomeSet}
  ${agFragment}
`;

export function sortMeetingsByDateThenCreated(
  meetings: IMeeting[],
  asc = true
): IMeeting[] {
  return meetings.concat().sort((a, b): number => {
    const aDate = Date.parse(a.date ?? a.created);
    const bDate = Date.parse(b.date ?? b.created);
    if (asc) {
      return aDate - bDate;
    }
    return bDate - aDate;
  });
}
