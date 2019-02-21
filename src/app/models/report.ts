import {gql} from 'react-apollo';

export interface IDateTimeValue {
  value: number;
  timestamp: Date;
}

export interface IStats {
  delta: number;
  lobfDelta: number;
  roc: number;
}

export interface IID {
  id: string;
}

export interface IAnswerSummary {
  aID: string;
  initial: IDateTimeValue;
  latest: IDateTimeValue;
  noRecords: number;
  reportCoverage: number;
  stats: IStats;
}

export interface IBenSummary extends IID {
  questions: IAnswerSummary[];
  categories: IAnswerSummary[];
}

export interface IAnswerAggregation extends IID {
  initial: number;
  latest: number;
  stats: IStats;
}

export interface IExclusion {
  beneficiary?: string;
  question?: string;
  category?: string;
  reason: string;
}

export interface IAnswerAggregationReport {
  beneficiaries: IID[];
  questions: IAnswerAggregation[];
  categories: IAnswerAggregation[];
  excluded: IExclusion[];
}

export interface IBeneficiaryAggregationReport {
  beneficiaries: IBenSummary[];
  excluded: IExclusion[];
}

export interface IReport {
  beneficiaries: IBenSummary[];
  questions: IAnswerAggregation[];
  categories: IAnswerAggregation[];
  excluded: IExclusion[];
}

export const answerAggregationFragment = gql`
  fragment answerAggregationFragment on Report {
    beneficiaries {
      id
    },
    questions {
      id,
      stats {
        delta
      },
      initial,
      latest
    },
    categories {
      id,
      stats {
        delta,
        lobfDelta,
        roc
      },
      initial,
      latest
    },
    excluded {
      beneficiary,
      question,
      category,
      reason
    }
  }`;

export const beneficiaryAggregationFragment = gql`
  fragment beneficiaryAggregationFragment on Report {
    beneficiaries {
      id,
      categories {
        aID: id,
        initial {
          value,
          timestamp
        },
        latest {
          value,
          timestamp
        },
        noRecords,
        reportCoverage,
        stats {
          delta,
          lobfDelta,
          roc
        }
      }
      questions {
        aID: id,
        initial {
          value,
          timestamp
        },
        latest {
          value,
          timestamp
        },
        noRecords,
        reportCoverage,
        stats {
          delta,
          lobfDelta,
          roc
        }
      }
    },
    excluded {
      beneficiary,
      question,
      category,
      reason
    }
  }`;

export interface IExcluded {
  categoryIDs: string[];
  questionIDs: string[];
  beneficiaryIDs: string[];
}
