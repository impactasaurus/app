import {gql, graphql, QueryProps} from 'react-apollo';
import {IDExtractor} from 'helpers/apollo';
import {fragment, IBeneficiary} from 'models/beneficiary';

export const getBeneficiaries = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getBeneficiaries: beneficiaries
    }`, {
    options: () => {
      return {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      };
    },
    name,
  })(component);
};

export interface IBeneficiariesResult extends QueryProps {
  getBeneficiaries?: string[];
}

export const getBeneficiary = <T>(benID: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query ($id: String!){
      getBeneficiary: beneficiary(id:$id) {
        ...defaultBeneficiary
      }
    } ${fragment}`, {
    options: (props: T) => {
      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: benID(props),
        },
      };
    },
  });
};

export interface IBeneficiaryResult extends QueryProps {
  getBeneficiary?: IBeneficiary;
}
