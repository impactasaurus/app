import {gql, graphql, QueryProps} from 'react-apollo';
import {IMeeting, fragment, fragmentWithOutcomeSetAndAggregates} from 'models/meeting';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';

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

const getMeetingGQL = gql`
  query ($beneficiaryID: String!) {
    getMeetings: meetings(beneficiary: $beneficiaryID) {
      ...meetingWithOutcomeSetAndAggregates
    }
  }
  ${fragmentWithOutcomeSetAndAggregates}`;

export const getMeetings = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(getMeetingGQL, {
    options: (props: T) => {
      return {
        variables: {
          beneficiaryID: idExtractor(props),
        },
      };
    },
  });
};

export const newMeeting = graphql(gql`
  mutation ($beneficiaryID: String!, $outcomeSetID: String!, $conducted: String!) {
    newMeeting: AddMeeting(beneficiaryID:$beneficiaryID, outcomeSetID:$outcomeSetID, conducted:$conducted) {
      ...defaultMeeting
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      newMeeting: (beneficiaryID: string, outcomeSetID: string, conducted: Date): Promise<IMeeting> => mutate({
        variables: {
            beneficiaryID,
            outcomeSetID,
            conducted: conducted.toISOString(),
        },
        refetchQueries: [{
          query: getMeetingGQL,
          variables: { beneficiaryID },
        }],
      }).then(mutationResultExtractor<IMeeting>('newMeeting')),
    }),
  });

export function addLikertAnswer<T>(component) {
  return graphql<any, T>(gql`
  mutation ($meetingID: String!, $questionID: String!, $value: Int!) {
    addLikertAnswer: AddLikertAnswer(meetingID: $meetingID, questionID: $questionID, value: $value) {
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

export interface IMeetingResult extends QueryProps {
    getMeeting?: IMeeting;
    getMeetings?: IMeeting[];
}

export interface IMeetingMutation {
    newMeeting(beneficiaryID: string, outcomeSetID: string, conducted: Date): Promise<IMeeting>;
    addLikertAnswer(meetingID: string, questionID: string, value: number): Promise<IMeeting>;
}
