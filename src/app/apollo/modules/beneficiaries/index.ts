import {gql, graphql, QueryProps} from 'react-apollo';

export const getBeneficiaries = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getBeneficiaries: beneficiaries
    }`, {
    options: () => {
      return {
        fetchPolicy: 'network-only',
      };
    },
    name,
  })(component);
};

export interface IBeneficiaryResult extends QueryProps {
  getBeneficiaries?: string[];
}
