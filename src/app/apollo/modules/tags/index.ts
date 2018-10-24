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
        notifyOnNetworkStatusChange: true,
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
      suggestedTags: suggestTags(beneficiary:$ben)
    }`,
    {
      options: (props: T) => {
        const ben = idExtractor(props);
        return {
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
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
  suggestedTags?: string[];
}

export const suggestQuestionnaireTags = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query suggestTags($qID: String!) {
      suggestedTags: suggestQuestionnaireTags(questionnaire:$qID)
    }`,
    {
      options: (props: T) => {
        const qID = idExtractor(props);
        return {
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
          variables: {
            qID,
          },
          skip: qID === '' || isNullOrUndefined(qID),
        };
      },
    },
  );
};
