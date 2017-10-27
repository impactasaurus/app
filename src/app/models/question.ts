import {gql} from 'react-apollo';

export interface IQuestion {
  id: string;
  question: string;
  description?: string;
  archived?: boolean;
  categoryID: string;
}

export interface ILikertScale extends IQuestion {
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue: number;
}

export type Question = ILikertScale;

export interface ILikertQuestionForm {
  question?: string;
  description?: string;
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue?: number;
}

export const fragment = gql`
  fragment defaultQuestion on QuestionInterface {
    id,
    question,
    description,
    archived,
    categoryID,
    ... on LikertScale{
        minLabel,
        maxLabel,
        minValue,
        maxValue,
    }
  }`;
