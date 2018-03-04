import {graphql, QueryProps} from 'react-apollo';
import {IMeeting, fragment, fragmentWithOutcomeSetAndAggregates} from 'models/meeting';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';
import { invalidateFields, ROOT } from 'apollo-cache-invalidation';
import {IAssessmentConfig} from 'models/assessment';
import gql from 'graphql-tag';

// see impactasaurus/app#55, not an ideal fix
// forces refetch of meeting related queries by deleting root query pointers for `meeting` and `meetings` queries
export function clearCacheOfAllMeetings() {
  return invalidateFields(() => [
    [ROOT, /^meeting.*/],
  ]);
}

export const getMeeting = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query ($id: String!){
      getMeeting: meeting(id:$id) {
        ...meetingWithOutcomeSetAndAggregates
      }
    }
    ${fragmentWithOutcomeSetAndAggregates}`, {
    options: (props: T) => {
      return {
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

const getMeetingsGQL = gql`
  query ($beneficiaryID: String!) {
    getMeetings: meetings(beneficiary: $beneficiaryID) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}`;

export const getMeetings = <T>(idExtractor: IDExtractor<T>, name?: string) => {
  return graphql<any, T>(getMeetingsGQL, {
    options: (props: T) => {
      return {
        variables: {
          beneficiaryID: idExtractor(props),
        },
      };
    },
    name: name ? name : 'data',
  });
};

export const newMeeting = graphql(gql`
  mutation ($beneficiaryID: String!, $outcomeSetID: String!, $conducted: String!, $tags: [String]) {
    newMeeting: AddMeeting(beneficiaryID:$beneficiaryID, outcomeSetID:$outcomeSetID, conducted:$conducted, tags:$tags) {
      ...defaultMeeting
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      newMeeting: (config: IAssessmentConfig): Promise<IMeeting> => mutate({
        variables: {
          beneficiaryID: config.beneficiaryID,
          outcomeSetID: config.outcomeSetID,
          conducted: config.date ? config.date.toISOString() : new Date().toISOString(),
          tags: config.tags || [],
        },
        refetchQueries: [{
          query: getMeetingsGQL,
          variables: {
            beneficiaryID: config.beneficiaryID,
          },
        }],
      }).then(mutationResultExtractor<IMeeting>('newMeeting')),
    }),
  });

export const newRemoteMeeting = graphql(gql`
  mutation($beneficiaryID: String!, $outcomeSetID: String!, $daysToComplete: Int!, $tags: [String]) {
    newRemoteMeeting: AddRemoteMeeting(beneficiaryID:$beneficiaryID, outcomeSetID:$outcomeSetID, daysToComplete:$daysToComplete, tags:$tags){
      JTI
    }
  }
`, {
    props: ({ mutate }) => ({
      newRemoteMeeting: (config: IAssessmentConfig, daysToComplete: number): Promise<string> => mutate({
        variables: {
          beneficiaryID: config.beneficiaryID,
          outcomeSetID: config.outcomeSetID,
          daysToComplete: Math.ceil(daysToComplete),
          tags: config.tags || [],
        },
        refetchQueries: [{
          query: getMeetingsGQL,
          variables: {
            beneficiaryID: config.beneficiaryID,
          },
        }],
      }).then(mutationResultExtractor<{
        JTI: string,
      }>('newRemoteMeeting'))
      .then((x) => x.JTI),
    }),
  });

export function addLikertAnswer<T>(component) {
  return graphql<any, T>(gql`
  mutation ($meetingID: String!, $questionID: String!, $value: Int!) {
    addLikertAnswer: AddLikertAnswer(meetingID: $meetingID, questionID: $questionID, value: $value, allowOverwrite:true) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}`, {
    props: ({ mutate }) => ({
      addLikertAnswer: (meetingID: string, questionID: string, value: number): Promise<IMeeting> => mutate({
        variables: {
          meetingID,
          questionID,
          value,
        },
      }).then(mutationResultExtractor<IMeeting>('addLikertAnswer')),
    }),
  })(component);
}

export function completeMeeting<T>(component) {
  return graphql<any, T>(gql`
  mutation ($meetingID: String!) {
    completeMeeting: CompleteMeeting(meetingID: $meetingID) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}`, {
    props: ({ mutate }) => ({
      completeMeeting: (meetingID: string, beneficiaryID: string): Promise<IMeeting> => mutate({
        variables: {
          meetingID,
        },
        refetchQueries: [{
          query: getMeetingsGQL,
          variables: { beneficiaryID },
        }],
      }).then(mutationResultExtractor<IMeeting>('completeMeeting')),
    }),
  })(component);
}

export interface IMeetingResult extends QueryProps {
  getMeeting?: IMeeting;
  getMeetings?: IMeeting[];
}

export interface IMeetingMutation {
  newMeeting(config: IAssessmentConfig): Promise<IMeeting>;
  newRemoteMeeting(config: IAssessmentConfig, daysToComplete: number): Promise<string>;
  addLikertAnswer(meetingID: string, questionID: string, value: number): Promise<IMeeting>;
  completeMeeting(meetingID: string, beneficiaryID: string): Promise<IMeeting>;
}
