import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';
import {clearCacheOfAllMeetings} from 'apollo/modules/meetings';

export function addLikertQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $question: String!, $description: String, $minValue: Int, $maxValue: Int!, $minLabel: String, $maxLabel: String, $categoryID: String) {
    addLikertQuestion: AddLikertQuestion(outcomeSetID:$outcomeSetID, question: $question, description: $description, minValue: $minValue, maxValue: $maxValue, minLabel: $minLabel, maxLabel: $maxLabel, categoryID: $categoryID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addLikertQuestion: (outcomeSetID: string, question: string, minValue: number, maxValue: number, minLabel?: string, maxLabel?: string, description?: string, categoryID?: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            question,
            description,
            minValue,
            maxValue,
            minLabel,
            maxLabel,
            categoryID,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('addLikertQuestion')),
    }),
  })(component);
}

export function editLikertQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $questionID: ID!, $question: String!, $description: String, $minLabel: String, $maxLabel: String, $categoryID: ID) {
    editLikertQuestion: EditLikertQuestion(outcomeSetID:$outcomeSetID, questionID: $questionID, question: $question, description: $description, minLabel: $minLabel, maxLabel: $maxLabel) {
      ...defaultOutcomeSet
    },
    setCategory: SetCategory(outcomeSetID: $outcomeSetID, questionID: $questionID, categoryID: $categoryID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    options: {
      refetchQueries: ['getOutcomeSet'],
    },
    props: ({ mutate }) => ({
      editLikertQuestion: (outcomeSetID: string, questionID: string, question: string, minLabel?: string, maxLabel?: string, description?: string, categoryID?: string): Promise<IOutcomeSet> => mutate({
        variables: {
          outcomeSetID,
          questionID,
          question,
          description,
          minLabel,
          maxLabel,
          categoryID,
        },
        update: clearCacheOfAllMeetings(),
      }).then(mutationResultExtractor<IOutcomeSet>('setCategory')),
    }),
  })(component);
}

export function deleteQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: String!, $questionID: String!) {
    deleteQuestion: DeleteQuestion(outcomeSetID:$outcomeSetID, questionID: $questionID) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      deleteQuestion: (outcomeSetID: string, questionID: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            questionID,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('deleteQuestion')),
    }),
  })(component);
}

export interface IQuestionMutation {
  addLikertQuestion?(outcomeSetID: string, question: string, minValue: number, maxValue: number, minLabel?: string, maxLabel?: string, description?: string, categoryID?: string): Promise<IOutcomeSet>;
  editLikertQuestion?(outcomeSetID: string, questionID: string, question: string, minLabel?: string, maxLabel?: string, description?: string, categoryID?: string): Promise<IOutcomeSet>;
  deleteQuestion?(outcomeSetID: string, questionID: string): Promise<IOutcomeSet>;
}
