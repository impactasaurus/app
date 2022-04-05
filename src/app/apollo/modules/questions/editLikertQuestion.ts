import { IOutcomeSet, fragment } from "models/outcomeSet";
import { ILabel } from "models/question";
import { ComponentClass } from "react";
import { CompositeComponent } from "react-apollo/types";
import { gql, graphql } from "react-apollo";
import { cleanLabelArray } from ".";
import { mutationResultExtractor } from "helpers/apollo";

export interface IEditLikertQuestionInput {
  question?: string;
  description?: string;
  short?: string;
  labels?: ILabel[];
  leftValue?: number;
  rightValue?: number;
}

export interface IEditLikertQuestion {
  editLikertQuestion?(
    questionnaireID: string,
    questionID: string,
    i: IEditLikertQuestionInput
  ): Promise<IOutcomeSet>;
}

export const editLikertQuestion = <T>(
  component: CompositeComponent<T>
): ComponentClass<T> => {
  return graphql<IOutcomeSet, T>(
    gql`
      mutation (
        $questionnaireID: ID!
        $questionID: ID!
        $question: String
        $description: String
        $labels: [LabelInput]
        $short: String
        $leftValue: Int
        $rightValue: Int
      ) {
        editLikertQuestion: EditLikertQuestion(
          outcomeSetID: $questionnaireID
          questionID: $questionID
          question: $question
          description: $description
          labels: $labels
          short: $short
          minValue: $leftValue
          maxValue: $rightValue
        ) {
          ...defaultOutcomeSet
        }
      }
      ${fragment}
    `,
    {
      props: ({ mutate }) => ({
        editLikertQuestion: (
          questionnaireID: string,
          questionID: string,
          i: IEditLikertQuestionInput
        ): Promise<IOutcomeSet> =>
          mutate({
            variables: {
              ...i,
              labels: cleanLabelArray(i.labels),
              questionnaireID,
              questionID,
            },
          }).then(mutationResultExtractor<IOutcomeSet>("editLikertQuestion")),
      }),
    }
  )(component);
};
