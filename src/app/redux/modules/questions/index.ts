import {gql, graphql} from 'react-apollo';
import {fragment as osFragment} from 'models/outcomeSet';

export const addLikertQuestion = graphql(gql`
  mutation ($outcomeSetID: ID!, $question: String!, $maxValue: Int!) {
    addLikertQuestion: AddLikertQuestion(outcomeSetID:$outcomeSetID, question: $question, maxValue: $maxValue) {
      ...defaultOutcomeSet
    }
  }
  ${osFragment}`, {
    props: ({ mutate }) => ({
      addLikertQuestion: (outcomeSetID: string, question: string, maxValue: number) => mutate({
          variables: {
            outcomeSetID,
            question,
            maxValue,
          },
      }),
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
      deleteQuestion: (outcomeSetID: string, questionID: string) => mutate({
          variables: {
            outcomeSetID,
            questionID,
          },
      }),
    }),
  });

export interface IQuestionMutation {
    addLikertQuestion(outcomeSetID: string, question: string, maxValue: number);
    deleteQuestion(outcomeSetID: string, questionID: string);
}
