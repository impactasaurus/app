import {gql, graphql, QueryProps} from 'react-apollo';
import {IMeeting, fragment, fragmentWithOutcomeSet} from 'models/meeting';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';

export const getMeeting = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query ($id: String!){
      getMeeting: meeting(id:$id) {
        ...meetingWithOutcomeSet
      }
    }
    ${fragmentWithOutcomeSet}`, {
    options: (props: T) => {
      return {
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

export const getMeetings = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query ($beneficiaryID: String!) {
      getMeetings: meetings(beneficiary: $beneficiaryID) {
        ...meetingWithOutcomeSet
      }
    }
    ${fragmentWithOutcomeSet}`, {
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
      }).then(mutationResultExtractor<IMeeting>('newMeeting')),
    }),
  });

export function addLikertAnswer<T>(component) {
  return graphql<any, T>(gql`
  mutation ($meetingID: String!, $questionID: String!, $value: Int!) {
    addLikertAnswer: AddLikertAnswer(meetingID: $meetingID, questionID: $questionID, value: $value) {
      ...meetingWithOutcomeSet
    }
  }
  ${fragmentWithOutcomeSet}`, {
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
