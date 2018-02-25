import {gql, graphql, QueryProps} from 'react-apollo';

export const getTags = <T>(component)  => {
  return graphql<any, T>(gql`
    query {
      getTags: tags
    }`, {
    options: () => {
      return {
        fetchPolicy: 'network-only',
      };
    },
  })(component);
};

export interface ITagResult extends QueryProps {
  getTags?: string[];
}
