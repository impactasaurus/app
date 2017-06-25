import {gql, graphql} from 'react-apollo';
import {IMeeting, fragment} from 'models/meeting';
import {mutationResultExtractor} from 'helpers/apollo';

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

export interface IMeetingMutation {
    newMeeting(beneficiaryID: string, outcomeSetID: string, conducted: Date): Promise<IMeeting>;
}
