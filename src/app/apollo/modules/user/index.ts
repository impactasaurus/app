import {gql, graphql, QueryProps} from 'react-apollo';
import {mutationResultExtractor} from 'helpers/apollo';
import {ISelf, selfFragment} from 'models/user';

export const getSelf = <T>(component, name: string = undefined)  => {
  return graphql<any, T>(gql`
    query {
      getSelf: self {
        ...defaultSelf
      }
    } ${selfFragment}`, {
    options: () => {
      return {
        notifyOnNetworkStatusChange: true,
      };
    },
    name,
  })(component);
};

export interface IGetSelf extends QueryProps {
  getSelf?: ISelf;
}

export function updateSelf<T>(component) {
  return graphql<any, T>(gql`
  mutation ($unsubscribed: Boolean, $name: String) {
    updateSelf: UpdateSelf(unsubscribed:$unsubscribed, name: $name) {
        ...defaultSelf
    }
  } ${selfFragment}`, {
    props: ({ mutate }) => ({
      updateSelf: (name: string, unsubscribed: boolean): Promise<ISelf> => mutate({
        variables: {
          unsubscribed,
          name,
        },
      }).then(mutationResultExtractor<ISelf>('updateSelf')),
    }),
  })(component);
}

export interface IUpdateSelf {
  updateSelf?(name: string, unsubscribed: boolean): Promise<ISelf>;
}

export function unsubscribe<T>(component) {
  return graphql<any, T>(gql`
  mutation ($userID: String!) {
    unsubscribe: Unsubscribe(userID:$userID)
  }`, {
    props: ({ mutate }) => ({
      unsubscribe: (userID: string): Promise<any> => mutate({
        variables: {
          userID,
        },
      }),
    }),
  })(component);
}

export interface IUnsubscribe {
  unsubscribe(userID: string): Promise<any>;
}

export function updateUser<T>(component) {
  return graphql<any, T>(gql`
  mutation ($id: String!, $active: Boolean) {
    updateUser: UpdateUser(id: $id, active:$active) {
      id
      name
      joined
      active
    }
  }`, {
    props: ({ mutate }) => ({
      updateUser: (id: string, active?: boolean): Promise<any> => mutate({
        variables: {
          id,
          active,
        },
      }),
    }),
  })(component);
}

export interface IUpdateUser {
  updateUser(id: string, active?: boolean): Promise<any>;
}
