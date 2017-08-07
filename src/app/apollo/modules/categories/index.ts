import {gql, graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';

export function addQuestionCategory<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $aggregation: Aggregation!, $name: String!, $description: String) {
    addCategory: AddCategory(aggregation:$aggregation, outcomeSetID:$outcomeSetID, name:$name, description:$description) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addCategory: (outcomeSetID: string, name: string, aggregation: string, description?: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            name,
            aggregation,
            description,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('addCategory')),
    }),
  })(component);
}

export function deleteCategory<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: String!, $categoryID: String!) {
    deleteCategory: DeleteCategory(outcomeSetID:$outcomeSetID, categoryID: $categoryID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      deleteCategory: (outcomeSetID: string, categoryID: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            categoryID,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('deleteCategory')),
    }),
  })(component);
}

export interface ICategoryMutation {
    addCategory?(outcomeSetID: string, name: string, aggregation: string, description?: string): Promise<IOutcomeSet>;
    deleteCategory?(outcomeSetID: string, categoryID: string): Promise<IOutcomeSet>;
}
