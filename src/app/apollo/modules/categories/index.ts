import {graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';
import {clearCacheOfAllMeetings} from 'apollo/modules/meetings';
import gql from 'graphql-tag';

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
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IOutcomeSet>('addCategory')),
    }),
  })(component);
}

export function editQuestionCategory<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $categoryID: String!, $aggregation: Aggregation!, $name: String!, $description: String) {
    editCategory: EditCategory(aggregation:$aggregation, categoryID: $categoryID, outcomeSetID:$outcomeSetID, name:$name, description:$description) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      editCategory: (outcomeSetID: string, categoryID: string, name: string, aggregation: string, description?: string): Promise<IOutcomeSet> => mutate({
        variables: {
          categoryID,
          outcomeSetID,
          name,
          aggregation,
          description,
        },
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IOutcomeSet>('editCategory')),
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
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IOutcomeSet>('deleteCategory')),
    }),
  })(component);
}

export function setCategory<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $questionID: ID!, $categoryID: ID) {
    setCategory: SetCategory(outcomeSetID: $outcomeSetID, questionID: $questionID, categoryID: $categoryID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      setCategory: (outcomeSetID: string, questionID: string, categoryID?: string): Promise<IOutcomeSet> => mutate({
        variables: {
          outcomeSetID,
          questionID,
          categoryID,
        },
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IOutcomeSet>('setCategory')),
    }),
  })(component);
}

export interface ICategoryMutation {
    addCategory?(outcomeSetID: string, name: string, aggregation: string, description?: string): Promise<IOutcomeSet>;
    editCategory?(outcomeSetID: string, categoryID: string, name: string, aggregation: string, description?: string): Promise<IOutcomeSet>;
    deleteCategory?(outcomeSetID: string, categoryID: string): Promise<IOutcomeSet>;
    setCategory?(outcomeSetID: string, questionID: string, categoryID?: string): Promise<IOutcomeSet>;
}
