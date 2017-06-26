import {gql, graphql} from 'react-apollo';
import {IOutcomeSet, fragment as osFragment} from 'models/outcomeSet';
import {mutationResultExtractor} from 'helpers/apollo';

export const addLikertQuestion = graphql(gql`
  mutation ($outcomeSetID: ID!, $question: String!, $maxValue: Int!) {
    addLikertQuestion: AddLikertQuestion(outcomeSetID:$outcomeSetID, question: $question, maxValue: $maxValue) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addLikertQuestion: (outcomeSetID: string, question: string, maxValue: number): Promise<IOutcomeSet> => mutate({
          variables: {
            outcomeSetID,
            question,
            maxValue,
          },
      }).then(mutationResultExtractor<IOutcomeSet>('newQuestionSet')),
    }),
  });

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
      }).then(mutationResultExtractor<IOutcomeSet>('newQuestionSet')),
    }),
  });

export interface IQuestionMutation {
    addLikertQuestion(outcomeSetID: string, question: string, maxValue: number): Promise<IOutcomeSet>;
    deleteQuestion(outcomeSetID: string, questionID: string): Promise<IOutcomeSet>;
}
