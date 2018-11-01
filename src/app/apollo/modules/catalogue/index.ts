import {gql, graphql, QueryProps} from 'react-apollo';
import {fragment} from 'models/outcomeSet';
import {IDExtractor} from 'helpers/apollo';
import {IOutcomeSet} from '../../../models/outcomeSet';
import {mutationResultExtractor} from '../../../helpers/apollo';

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

export function getCatalogueQuestionnaires<T>(component) {
  return graphql<any, T>(gql`
    query getCatalogueQuestionnaires {
      getCatalogueQuestionnaires: outcomesetCatalogue(source:"softoutcomes") {
        ...defaultOutcomeSet
      }
    }
    ${fragment}`)(component);
}

export interface ICatalogueQuestionnaires extends QueryProps {
  getCatalogueQuestionnaires?: IOutcomeSet[];
}

export function importQuestionnaire<T>(component) {
  return graphql<any, T>(gql`
  mutation ($id: String!) {
    importQuestionnaire: ImportOutcomeSet(source:"softoutcomes", id:$id) {
      ...defaultOutcomeSet
    }
  }
  ${fragment}`, {
    props: ({ mutate }) => ({
      importQuestionnaire: (id: string): Promise<IOutcomeSet> => mutate({
        variables: {
          id,
        },
      }).then(mutationResultExtractor<IOutcomeSet>('importQuestionnaire')),
    }),
  })(component);
}

export interface ICatalogueImport {
  importQuestionnaire?(id: string): Promise<IOutcomeSet>;
}
