import {gql, graphql, QueryProps} from 'react-apollo';
import {IDExtractor} from '../../../helpers/apollo';
import {isNullOrUndefined} from 'util';

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

export const suggestTags = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query suggestTags($ben: String!) {
      suggestTags: suggestTags(beneficiary:$ben)
    }`,
    {
      options: (props: T) => {
        const ben = idExtractor(props);
        return {
          variables: {
            ben,
          },
          skip: ben === '' || isNullOrUndefined(ben),
        };
      },
    },
  );
};

export interface ISuggestTagsResult extends QueryProps {
  suggestTags?: string[];
}
