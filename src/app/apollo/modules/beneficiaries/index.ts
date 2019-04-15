import {gql, graphql, QueryProps} from 'react-apollo';
import {IDExtractor, mutationResultExtractor} from 'helpers/apollo';
import {fragment, IBeneficiary} from 'models/beneficiary';
import {clearCacheOfAllMeetings} from '../meetings';

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

export function editBeneficiaryTags<T>(component) {
  return graphql<any, T>(gql`
  mutation EditBeneficiaryTags ($benID: String!, $tags: [String]) {
    editBeneficiaryTags: EditBeneficiaryTags(id: $benID, tags: $tags) {
      ...defaultBeneficiary
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      editBeneficiaryTags: (benID: string, tags: string[]) => mutate({
        variables: {
          benID,
          tags: tags || [],
        },
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IBeneficiary>('editBeneficiaryTags')),
    }),
  })(component);
}

export interface IEditBeneficiaryTags {
  editBeneficiaryTags(benID: string, tags: string[]): Promise<IBeneficiary>;
}
