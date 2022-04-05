import { gql, graphql } from "react-apollo";
import { IOutcomeSet, fragment as osFragment } from "models/outcomeSet";
import { mutationResultExtractor } from "helpers/apollo";
import { ILabel } from "models/question";

// cleanLabelArray defends against __typename attributes
export const cleanLabelArray = (labels: ILabel[]): ILabel[] => {
  return labels.map<ILabel>(
    (l: ILabel): ILabel => ({
      label: l.label,
      value: l.value,
    })
  );
};

export function addLikertQuestion<T>(component) {
  return graphql<any, T>(
    gql`
      mutation (
        $outcomeSetID: ID!
        $question: String!
        $description: String
        $minValue: Int
        $maxValue: Int!
        $labels: [LabelInput]
        $categoryID: String
        $short: String
      ) {
        addLikertQuestion: AddLikertQuestion(
          outcomeSetID: $outcomeSetID
          question: $question
          description: $description
          minValue: $minValue
          maxValue: $maxValue
          labels: $labels
          categoryID: $categoryID
          short: $short
        ) {
          ...defaultOutcomeSet
        }
      }
      ${osFragment}
    `,
    {
      props: ({ mutate }) => ({
        addLikertQuestion: (
          outcomeSetID: string,
          question: string,
          minValue: number,
          maxValue: number,
          description?: string,
          short?: string,
          categoryID?: string,
          labels?: ILabel[]
        ): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              outcomeSetID,
              question,
              description,
              minValue,
              maxValue,
              short,
              labels: cleanLabelArray(labels),
              categoryID,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("addLikertQuestion")),
      }),
    }
  )(component);
}

export function deleteQuestion<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($outcomeSetID: String!, $questionID: String!) {
        deleteQuestion: DeleteQuestion(
          outcomeSetID: $outcomeSetID
          questionID: $questionID
        ) {
          ...defaultOutcomeSet
        }
      }
      ${osFragment}
    `,
    {
      props: ({ mutate }) => ({
        deleteQuestion: (
          outcomeSetID: string,
          questionID: string
        ): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              outcomeSetID,
              questionID,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("deleteQuestion")),
      }),
    }
  )(component);
}

export function moveQuestion<T>(component) {
  return graphql<any, T>(
    gql`
      mutation ($outcomeSetID: String!, $questionID: String!, $newIndex: Int!) {
        moveQuestion: MoveQuestion(
          outcomeSetID: $outcomeSetID
          questionID: $questionID
          newIndex: $newIndex
        ) {
          ...defaultOutcomeSet
        }
      }
      ${osFragment}
    `,
    {
      props: ({ mutate }) => ({
        moveQuestion: (
          outcomeset: IOutcomeSet,
          questionID: string,
          newIndex: number
        ): Promise<IOutcomeSet> => {
          let questions = outcomeset.questions.slice(0);
          const q = questions.find((q) => q.id === questionID);
          if (q === undefined) {
            return Promise.reject(
              new Error("Question ID not found in questions")
            );
          }
          questions = questions.filter((q) => q.id !== questionID);
          questions.splice(newIndex, 0, q);
          const optimistic: IOutcomeSet = {
            ...outcomeset,
            questions,
          };
          return mutate({
            variables: {
              outcomeSetID: outcomeset.id,
              questionID,
              newIndex,
            },
            optimisticResponse: {
              moveQuestion: optimistic,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("moveQuestion"));
        },
      }),
    }
  )(component);
}

export interface IQuestionMover {
  moveQuestion?(
    outcomeset: IOutcomeSet,
    questionID: string,
    newIndex: number
  ): Promise<IOutcomeSet>;
}

export interface IQuestionMutation {
  addLikertQuestion?(
    outcomeSetID: string,
    question: string,
    minValue: number,
    maxValue: number,
    description?: string,
    short?: string,
    categoryID?: string,
    labels?: ILabel[]
  ): Promise<IOutcomeSet>;
  deleteQuestion?(
    outcomeSetID: string,
    questionID: string
  ): Promise<IOutcomeSet>;
}
