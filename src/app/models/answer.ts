import gql from 'graphql-tag';

export interface IAnswer {
  questionID: string;
}

export interface IIntAnswer extends IAnswer {
  answer: number;
}

export type Answer = IIntAnswer;

export const fragment = gql`
  fragment defaultAnswer on AnswerInterface {
    questionID,
    ... on IntAnswer{
      answer,
    }
  }`;
