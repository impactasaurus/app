import { gql, graphql, QueryProps } from "react-apollo";
import { mutationResultExtractor } from "helpers/apollo";
import { ISelf, selfFragment } from "models/user";

const getSelfGQL = gql`
  query {
    getSelf: self {
      ...defaultSelf
    }
  }
  ${selfFragment}
`;

export const getSelf = <T>(component, name: string = undefined) => {
  return graphql<any, T>(getSelfGQL, {
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
  return graphql<any, T>(
    gql`
      mutation ($unsubscribed: Boolean, $name: String, $language: String) {
        updateSelf: UpdateSelf(
          unsubscribed: $unsubscribed
          name: $name
          language: $language
        ) {
          ...defaultSelf
        }
      }
      ${selfFragment}
    `,
    {
      options: {
        refetchQueries: [
          {
            query: getSelfGQL,
          },
        ],
      },
      props: ({ mutate }) => ({
        updateSelf: (
          name: string,
          unsubscribed: boolean,
          language: string
        ): Promise<ISelf> =>
          mutate({
            variables: {
              unsubscribed,
              name,
              language,
            },
          }).then(mutationResultExtractor<ISelf>("updateSelf")),
      }),
    }
  )(component);
}

export interface IUpdateSelf {
  updateSelf?(
    name: string,
    unsubscribed: boolean,
    language: string
  ): Promise<ISelf>;
}

export function unsubscribe<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($userID: String!) {
        unsubscribe: Unsubscribe(userID: $userID)
      }
    `,
    {
      props: ({ mutate }) => ({
        unsubscribe: (userID: string): Promise<any> =>
          mutate({
            variables: {
              userID,
            },
          }),
      }),
    }
  )(component);
}

export interface IUnsubscribe {
  unsubscribe(userID: string): Promise<any>;
}

export function recordUsage<T>(component) {
  return graphql<any, T>(
    gql`
      mutation {
        recordUsage: RecordUsage
      }
    `,
    {
      props: ({ mutate }) => ({
        recordUsage: (): Promise<boolean> =>
          mutate({}).then(mutationResultExtractor<boolean>("recordUsage")),
      }),
    }
  )(component);
}

export interface IRecordUsage {
  recordUsage(): Promise<boolean>;
}
