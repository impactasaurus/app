import {gql, graphql, QueryProps} from 'react-apollo';
import {fragment} from 'models/outcomeSet';
import {IDExtractor} from 'helpers/apollo';
import {IOutcomeSet} from '../../../models/outcomeSet';

export const getCatalogueQuestionnaire = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(gql`
    query getCatalogueQuestionnaire($id: String!) {
      getCatalogueQuestionnaire: catalogueQuestionnaire(id:$id, source:"softoutcomes") {
        ...defaultOutcomeSet
      }
    }
    ${fragment}`,
  {
    options: (props: T) => {
      return {
        variables: {
          id: idExtractor(props),
        },
      };
    },
  });
};

export interface ICatalogueQuestionnaire extends QueryProps {
  getCatalogueQuestionnaire?: IOutcomeSet;
}
