import {gql, graphql, QueryProps} from 'react-apollo';
import {IOrganisation} from 'models/organisation';
import {mutationResultExtractor, IDExtractor} from 'helpers/apollo';

export const getOrganisation = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getOrganisation: organisation {
        id,
        name,
        don,
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
      signup: (name: string, email: string, password: string, org: string): Promise<any> => mutate({
        variables: {
          name,
          email,
          password,
          org,
        },
      }),
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
      acceptInvite: (name: string, email: string, password: string, invite: string): Promise<any> => mutate({
        variables: {
          name,
          email,
          password,
          invite,
        },
      }),
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
  generateInvite?(): Promise<string>;
}

export interface IOrgUser {
  name: string;
  id: string;
  joined: Date;
  active: boolean;
}

export const getOrgUsers = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getOrgUsers: organisation {
        id
        users {
          id
          name
          joined
          active
        }
      }
    }`, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
      };
    },
    props: (query) => {
      let users: IOrgUser[] = [];
      if (query[name].getOrgUsers) {
        users = query[name].getOrgUsers.users.map((u) => ({
          id: u.id,
          name: u.name,
          active: u.active,
          joined: new Date(u.joined),
        }));
      }
      return {
        [name]: {
          ...query[name],
          users,
        },
      };
    },
    name,
  })(component);
};

export interface IGetOrgUsersResult extends QueryProps {
  users?: IOrgUser[];
}

export const hasOrgGeneratedReport = <T>(component, name = 'data')  => {
  return graphql<any, T>(gql`
    query {
      hasOrgGeneratedReport: organisation {
        id
        generatedReport
      }
    }`, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
      };
    },
    props: (query) => {
      let out = false;
      if (query[name] && query[name].hasOrgGeneratedReport) {
        out = query[name].hasOrgGeneratedReport.generatedReport;
      }
      return {
        [name]: {
          ...query[name],
          reportGenerated: out,
        },
      };
    },
    name,
  })(component);
};

export interface IHasOrgGeneratedReport extends QueryProps {
  reportGenerated?: boolean;
}

export interface IUserOrg {
  id: string;
  name: string;
}

export const getOrganisations = <T>(component, name: string = undefined) => {
  return graphql<IUserOrg, T>(gql`
    query {
      getOrganisations: organisations {
        id,
        name,
      }
    }`, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
      };
    },
    name,
  })(component);
};

export interface IGetOrgsResult extends QueryProps {
  getOrganisations?: IUserOrg[];
}
