import { gql, graphql, QueryProps } from "react-apollo";
import {
  fragment,
  IOutcomeSet,
  ICatalogueOS,
  catalogueFragment,
} from "models/outcomeSet";
import { IDExtractor, mutationResultExtractor } from "helpers/apollo";
import { allOutcomeSetsGQL } from "apollo/modules/outcomeSets";

export const getCatalogueQuestionnaire = <T>(idExtractor: IDExtractor<T>) => {
  return graphql<any, T>(
    gql`
      query getCatalogueQuestionnaire($id: String!) {
        getCatalogueQuestionnaire: catalogueQuestionnaire(
          id: $id
          source: "softoutcomes"
        ) {
          ...catalogueOutcomeSet
        }
      }
      ${catalogueFragment}
    `,
    {
      options: (props: T) => {
        return {
          variables: {
            id: idExtractor(props),
          },
        };
      },
    }
  );
};

export interface ICatalogueQuestionnaire extends QueryProps {
  getCatalogueQuestionnaire?: ICatalogueOS;
}

export function getCatalogueQuestionnaires<T>(component) {
  return graphql<any, T>(gql`
    query getCatalogueQuestionnaires {
      getCatalogueQuestionnaires: outcomesetCatalogue(source: "softoutcomes") {
        ...catalogueOutcomeSet
      }
    }
    ${catalogueFragment}
  `)(component);
}

export interface ICatalogueQuestionnaires extends QueryProps {
  getCatalogueQuestionnaires?: ICatalogueOS[];
}

export function importQuestionnaire<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($id: String!) {
        importQuestionnaire: ImportOutcomeSet(source: "softoutcomes", id: $id) {
          ...defaultOutcomeSet
        }
      }
      ${fragment}
    `,
    {
      options: {
        refetchQueries: [
          {
            query: allOutcomeSetsGQL,
          },
        ],
      },
      props: ({ mutate }) => ({
        importQuestionnaire: (id: string): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              id,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("importQuestionnaire")),
      }),
    }
  )(component);
}

export interface ICatalogueImport {
  importQuestionnaire?(id: string): Promise<IOutcomeSet>;
}
