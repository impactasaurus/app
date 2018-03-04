import {graphql, QueryProps} from 'react-apollo';
import gql from 'graphql-tag';

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
