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

export function signup<T>(component) {
  return graphql<any, T>(gql`
  mutation ($name: String!, $email: String!, $password: String!, $org: String!) {
    signup: AddOrg(name:$name, org:$org, email:$email, password:$password) {
      id,
    }
  }`, {
    props: ({ mutate }) => ({
      signup: (name: string, email: string, password: string, org: string): Promise<void> => mutate({
        variables: {
          name,
          email,
          password,
          org,
        },
      }).then(()=> {}),
    }),
  })(component);
}

export interface ISignup {
  signup(name: string, email: string, password: string, org: string): Promise<void>;
}
