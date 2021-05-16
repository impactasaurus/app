import { gql } from "react-apollo";

export interface IAnswer {
  questionID: string;
  notes: string;
}

export interface IIntAnswer extends IAnswer {
  answer: number;
}

export type Answer = IIntAnswer;

export const fragment = gql`
  fragment defaultAnswer on AnswerInterface {
    questionID
    notes
    ... on IntAnswer {
      answer
    }
  }
`;
