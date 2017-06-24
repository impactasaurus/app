import {gql} from 'react-apollo';

export interface IQuestion {
  id: string;
  question: string;
}

export interface ILikertScale extends IQuestion {
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue: number;
}

export type Question = ILikertScale;

export const fragment = gql`
  fragment defaultQuestion on QuestionInterface {
    id,
    question,
    ... on LikertScale{
        minLabel,
        maxLabel,
        minValue,
        maxValue,
    }
  }`;
