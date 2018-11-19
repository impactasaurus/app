import {gql, graphql, QueryProps} from 'react-apollo';
import {IOrganisation} from 'models/organisation';
import {mutationResultExtractor} from 'helpers/apollo';
import {IDExtractor} from '../../../helpers/apollo';

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

export function acceptInvite<T>(component) {
  return graphql<any, T>(gql`
  mutation ($name: String!, $email: String!, $password: String!, $invite: String!) {
    acceptInvite: AcceptInvite(name:$name, invite:$invite, email:$email, password:$password)
  }`, {
    props: ({ mutate }) => ({
      acceptInvite: (name: string, email: string, password: string, invite: string): Promise<void> => mutate({
        variables: {
          name,
          email,
          password,
          invite,
        },
      }).then(()=> {}),
    }),
  })(component);
}

export interface IAcceptInvite {
  acceptInvite(name: string, email: string, password: string, invite: string): Promise<void>;
}

export const checkInvite = <T>(idExtractor: IDExtractor<T>)  => {
  return graphql<any, T>(gql`
    query ($id: String!) {
      checkInvite: invite(id:$id)
    }`, {
    options: (props: T) => {
      return {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

export interface ICheckInvite extends QueryProps {
  checkInvite?: string;
}

export function generateInvite<T>(component) {
  return graphql<any, T>(gql`
  mutation {
    generateInvite: GetInviteLink
  }`, {
    props: ({ mutate }) => ({
      generateInvite: (): Promise<string> => mutate({}).then(mutationResultExtractor<string>('generateInvite')),
    }),
  })(component);
}

export interface IGenerateInvite {
  generateInvite(): Promise<string>;
}
