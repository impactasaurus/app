import { gql } from "react-apollo";

export interface IQuestion {
  id: string;
  question: string;
  description?: string;
  short?: string;
  archived?: boolean;
  categoryID?: string;
}

export interface ILabel {
  value: number;
  label: string;
}

export interface IWithNotes {
  noteRequired?: boolean;
  notePrompt?: string;
  noteDeactivated?: boolean;
}

export interface ILikertScale extends IQuestion, IWithNotes {
  leftLabel?: string;
  rightLabel?: string;
  leftValue: number;
  rightValue: number;
  labels: ILabel[];
}

export type Question = ILikertScale;

export interface ILikertQuestionForm extends IWithNotes {
  question: string;
  categoryID?: string;
  description?: string;
  short?: string;
  labels: ILabel[];
  leftValue: number;
  rightValue: number;
}

export interface ILikertForm {
  leftValue: number;
  rightValue: number;
  labels: ILabel[];
}

export const fragment = gql`
  fragment defaultQuestion on QuestionInterface {
    id
    question
    description
    short
    archived
    categoryID
    ... on LikertScale {
      leftValue
      rightValue
      leftLabel
      rightLabel
      labels {
        value
        label
      }
      noteRequired
      notePrompt
      noteDeactivated
    }
  }
`;
