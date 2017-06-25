import {gql, graphql, QueryProps} from 'react-apollo';
import {IMeeting, fragment, fragmentWithOutcomeSet} from 'models/meeting';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';

export const getMeeting = <T>(idExtractor: IDExtractor<T>): any => {
  return graphql<T>(gql`
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

export interface IMeetingResult extends QueryProps {
    getMeeting?: IMeeting;
}

export interface IMeetingMutation {
    newMeeting(beneficiaryID: string, outcomeSetID: string, conducted: Date): Promise<IMeeting>;
}
