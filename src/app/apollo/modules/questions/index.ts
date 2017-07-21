import {gql, graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';

export function addLikertQuestion<T>(component) {
  return graphql<any, T>(gql`
  mutation ($outcomeSetID: ID!, $question: String!, $maxValue: Int!, $minLabel: String, $maxLabel: String) {
    addLikertQuestion: AddLikertQuestion(outcomeSetID:$outcomeSetID, question: $question, maxValue: $maxValue, minLabel: $minLabel, maxLabel: $maxLabel) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addLikertQuestion: (outcomeSetID: string, question: string, maxValue: number, minLabel?: string, maxLabel?: string): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            question,
            maxValue,
            minLabel,
            maxLabel,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('addLikertQuestion')),
    }),
  })(component);
}

export const deleteQuestion = graphql(gql`
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
  });

export interface IQuestionMutation {
    addLikertQuestion?(outcomeSetID: string, question: string, maxValue: number, minLabel?: string, maxLabel?: string): Promise<IOutcomeSet>;
    deleteQuestion?(outcomeSetID: string, questionID: string): Promise<IOutcomeSet>;
}
