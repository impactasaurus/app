import {gql, graphql, QueryProps} from 'react-apollo';
import {IOrganisation} from 'models/organisation';
import {mutationResultExtractor} from 'helpers/apollo';

export const getOrganisation = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getOrganisation: organisation {
        id,
        name,
        settings{
          beneficiaryTypeAhead
        }
      }
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

export interface IGetOrgResult extends QueryProps {
  getOrganisation?: IOrganisation;
}

export function updateOrgSetting<T>(component) {
  return graphql<any, T>(gql`
  mutation ($beneficiaryTypeAhead: Boolean) {
    updateOrgSetting: UpdateOrgSetting(beneficiaryTypeAhead:$beneficiaryTypeAhead) {
      id,
      name,
      settings{
        beneficiaryTypeAhead
      }
    }
  }`, {
    props: ({ mutate }) => ({
      updateOrgSetting: (beneficiaryTypeAhead: boolean): Promise<IOrganisation> => mutate({
        variables: {
          beneficiaryTypeAhead,
        },
      }).then(mutationResultExtractor<IOrganisation>('updateOrgSetting')),
    }),
  })(component);
}

export interface IUpdateOrgSettings {
  updateOrgSetting(beneficiaryTypeAhead: boolean): Promise<IOrganisation>;
}
