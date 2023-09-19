import { gql } from "react-apollo";

export interface IID {
  id: string;
}

export interface IExclusion {
  beneficiary?: string;
  question?: string;
  category?: string;
  reason: string;
}

export interface IAnswerDistance extends IID {
  initial: number;
  latest: number;
}

export interface IAnswerAggregationReport {
  beneficiaries: IID[];
  questions: IAnswerDistance[];
  categories: IAnswerDistance[];
  excluded: IExclusion[];
}

export const answerAggregationFragment = gql`
  fragment answerAggregationFragment on Report {
    beneficiaries {
      id
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
        noRecords
        stats {
          delta
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
        noRecords
        stats {
          delta
        }
      }
    }
    questions {
      id
      initial
      latest
      stats {
        delta
      }
    }
    categories {
      id
      initial
      latest
      stats {
        delta
      }
    }
    excluded {
      beneficiary
      question
      category
      reason
    }
  }
`;

export interface IExcluded {
  categoryIDs: string[];
  questionIDs: string[];
  beneficiaryIDs: string[];
}

export interface IReportStats {
  delta: number;
}

export interface IValue {
  value: number;
}

export interface IAnswerSummary extends IID {
  initial: IValue;
  latest: IValue;
  noRecords: number;
  stats: IReportStats;
}

export interface IBenReport extends IID {
  questions: IAnswerSummary[];
  categories: IAnswerSummary[];
}

export interface IAnswerAggregation extends IID {
  initial: number;
  latest: number;
  stats: IReportStats;
}

export interface IReport {
  beneficiaries: IBenReport[];
  questions: IAnswerAggregation[];
  categories: IAnswerAggregation[];
  excluded: IExclusion[];
}
