import {gql, graphql} from 'react-apollo';
import {mutationResultExtractor} from 'helpers/apollo';

export function newMeetingFromSummon <T>(component) {
  return graphql<any, T>(gql`
  mutation($beneficiaryID: String!, $summonID: String!) {
    newMeetingFromSummon: NewMeetingFromSummon(beneficiaryID:$beneficiaryID, summonID:$summonID){
      JTI
    }
  }
`, {
    props: ({ mutate }) => ({
      newMeetingFromSummon: (summonID: string, beneficiaryID: string): Promise<string> => mutate({
        variables: {
          summonID,
          beneficiaryID,
        },
      }).then(mutationResultExtractor<{
        JTI: string,
      }>('newMeetingFromSummon'))
        .then((x) => x.JTI),
    }),
  })(component);
}

export interface ISummonAcceptanceMutation {
  newMeetingFromSummon: (summonID: string, beneficiaryID: string) => Promise<string>;
}
