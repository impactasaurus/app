import {gql} from 'react-apollo';

export interface IQuestion {
  id: string;
  question: string;
  description?: string;
  archived?: boolean;
  categoryID: string;
}

export interface ILabel {
  value: number;
  label: string;
}

export interface ILikertScale extends IQuestion {
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: number;
  rightValue: number;
  labels: ILabel[];
}

export type Question = ILikertScale;

export interface ILikertQuestionForm {
  question?: string;
  categoryID?: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: number;
  rightValue?: number;
}

export const fragment = gql`
  fragment defaultQuestion on QuestionInterface {
    id,
    question,
    description,
    archived,
    categoryID,
    ... on LikertScale{
      leftValue,
      rightValue,
      leftLabel,
      rightLabel,
      labels {
        value,
        label
      }
    }
  }`;
