import { gql } from "react-apollo";

export const reportFragment = gql`
  fragment reportFragment on Report {
    beneficiaries {
      id
      questions {
        id
        initial {
          value
        }
        latest {
          value
        }
      }
      categories {
        id
        initial {
          value
        }
        latest {
          value
        }
      }
    }
    questions {
      id
      initial
      latest
    }
    categories {
      id
      initial
      latest
    }
    excluded {
      beneficiary
      question
      category
      reason
    }
  }
`;

export interface IID {
  id: string;
}

export interface IExclusion {
  beneficiary?: string;
  question?: string;
  category?: string;
  reason: string;
}

export interface IValue {
  value: number;
}

export interface IAnswerSummary extends IID {
  initial: IValue;
  latest: IValue;
}

export interface IBenReport extends IID {
  questions: IAnswerSummary[];
  categories: IAnswerSummary[];
}

export interface IAnswerAggregation extends IID {
  initial: number;
  latest: number;
}

export interface IReport {
  beneficiaries: IBenReport[];
  questions: IAnswerAggregation[];
  categories: IAnswerAggregation[];
  excluded: IExclusion[];
}
