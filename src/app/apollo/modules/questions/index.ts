import {gql, graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';

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
    deleteQuestion?(outcomeSetID: string, questionID: string): Promise<IOutcomeSet>;
}
