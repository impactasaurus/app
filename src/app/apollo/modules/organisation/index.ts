import { gql, graphql, QueryProps } from "react-apollo";
import { IOrganisation } from "models/organisation";
import { mutationResultExtractor, IDExtractor } from "helpers/apollo";
import { ComponentClass } from "react";

export const getOrganisation = <T>(component, name: string = undefined) => {
  return graphql<any, T>(
    gql`
      query {
        getOrganisation: organisation {
          id
          name
          don
          settings {
            beneficiaryTypeAhead
          }
          plugins {
            id
          }
        }
      }
    `,
    {
      options: () => {
        return {
          fetchPolicy: "network-only",
          notifyOnNetworkStatusChange: true,
        };
      },
      name,
    }
  )(component);
};

export interface IGetOrgResult extends QueryProps {
  getOrganisation?: IOrganisation;
}

export function updateOrgSetting<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($beneficiaryTypeAhead: Boolean) {
        updateOrgSetting: UpdateOrgSetting(
          beneficiaryTypeAhead: $beneficiaryTypeAhead
        ) {
          id
          name
          settings {
            beneficiaryTypeAhead
          }
        }
      }
    `,
    {
      props: ({ mutate }) => ({
        updateOrgSetting: (
          beneficiaryTypeAhead: boolean
        ): Promise<IOrganisation> =>
          mutate({
            variables: {
              beneficiaryTypeAhead,
            },
          }).then(mutationResultExtractor<IOrganisation>("updateOrgSetting")),
      }),
    }
  )(component);
}

export interface IUpdateOrgSettings {
  updateOrgSetting(beneficiaryTypeAhead: boolean): Promise<IOrganisation>;
}

export function signup<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $name: String!
        $email: String!
        $password: String!
        $org: String!
      ) {
        signup: AddOrg(
          name: $name
          org: $org
          email: $email
          password: $password
        ) {
          id
        }
      }
    `,
    {
      props: ({ mutate }) => ({
        signup: (
          name: string,
          email: string,
          password: string,
          org: string
        ): Promise<any> =>
          mutate({
            variables: {
              name,
              email,
              password,
              org,
            },
          }),
      }),
    }
  )(component);
}

export interface ISignup {
  signup(
    name: string,
    email: string,
    password: string,
    org: string
  ): Promise<void>;
}

export function acceptInvite<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $name: String
        $email: String
        $password: String
        $invite: String!
      ) {
        acceptInvite: AcceptInvite(
          name: $name
          invite: $invite
          email: $email
          password: $password
        )
      }
    `,
    {
      props: ({ mutate }) => ({
        acceptInvite: (
          invite: string,
          name?: string,
          email?: string,
          password?: string
        ): Promise<any> =>
          mutate({
            variables: {
              name,
              email,
              password,
              invite,
            },
          }),
      }),
    }
  )(component);
}

export interface IAcceptInvite {
  acceptInvite(
    invite: string,
    name?: string,
    email?: string,
    password?: string
  ): Promise<void>;
}

export const checkInvite = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(
    gql`
      query ($id: String!) {
        checkInvite: invite(id: $id)
      }
    `,
    {
      options: (props: T) => {
        return {
          fetchPolicy: "network-only",
          notifyOnNetworkStatusChange: true,
          variables: {
            id: idExtractor(props),
          },
        };
      },
    }
  );
};

export interface ICheckInvite extends QueryProps {
  checkInvite?: string;
}

export function generateInvite<T>(component) {
  return graphql<any, T>(
    gql`
      mutation {
        generateInvite: GetInviteLink
      }
    `,
    {
      props: ({ mutate }) => ({
        generateInvite: (): Promise<string> =>
          mutate({}).then(mutationResultExtractor<string>("generateInvite")),
      }),
    }
  )(component);
}

export interface IGenerateInvite {
  generateInvite?(): Promise<string>;
}

export function removeOrgUser<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($userID: String!) {
        removeOrgUser: RemoveUser(userID: $userID) {
          id
        }
      }
    `,
    {
      options: {
        notifyOnNetworkStatusChange: true,
        refetchQueries: [
          {
            query: getOrgUserGQL,
          },
        ],
      },
      props: ({ mutate }) => ({
        removeOrgUser: (userID: string): Promise<any> =>
          mutate({
            variables: {
              userID,
            },
          }),
      }),
    }
  )(component);
}

export interface IRemoveOrgUser {
  removeOrgUser?(userID: string): Promise<void>;
}

export interface IOrgUser {
  name: string;
  id: string;
  joined: Date;
  active: boolean;
}

const getOrgUserGQL = gql`
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
  }
`;

export const getOrgUsers = <T>(component, name: string = undefined) => {
  return graphql<any, T>(getOrgUserGQL, {
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

export const hasOrgGeneratedReport = <T>(component, name = "data") => {
  return graphql<any, T>(
    gql`
      query {
        hasOrgGeneratedReport: organisation {
          id
          generatedReport
        }
      }
    `,
    {
      options: () => {
        return {
          notifyOnNetworkStatusChange: true,
          fetchPolicy: "network-only",
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
    }
  )(component);
};

export interface IHasOrgGeneratedReport extends QueryProps {
  reportGenerated?: boolean;
}

export interface IUserOrg {
  id: string;
  name: string;
}

export const getOrganisations = <T>(component, name: string = undefined) => {
  return graphql<IUserOrg, T>(
    gql`
      query {
        getOrganisations: organisations(limit: 60) {
          id
          name
        }
      }
    `,
    {
      options: () => {
        return {
          notifyOnNetworkStatusChange: true,
        };
      },
      name,
    }
  )(component);
};

export interface IGetOrgsResult extends QueryProps {
  getOrganisations?: IUserOrg[];
}

export const setOrganisation = <T>(
  component: ComponentClass<T>
): ComponentClass<T> => {
  return graphql<boolean, T>(
    gql`
      mutation ($id: String!) {
        setOrganisation: SetActiveOrganisation(orgID: $id)
      }
    `,
    {
      props: ({ mutate }) => ({
        setOrganisation: (orgID: string): Promise<boolean> =>
          mutate({
            variables: {
              id: orgID,
            },
          }).then(mutationResultExtractor<boolean>("setOrganisation")),
      }),
    }
  )(component);
};

export interface ISetOrganisation {
  setOrganisation?(orgID: string): Promise<boolean>;
}
