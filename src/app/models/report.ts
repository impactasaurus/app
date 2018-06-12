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

export interface IAnswerSummary extends IID {
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
        delta,
        lobfDelta,
        roc
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
      ID,
      categories {
        id,
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
        id,
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

export interface IQuestionAggregates {
  questionID: string;
  value?: number;
  beneficiaryIDs: string[];
  warnings?: string[];
}
export interface ICategoryAggregates {
  categoryID: string;
  value?: number;
  beneficiaryIDs: string[];
  warnings?: string[];
}
export interface IJOCAggregates<T> {
  first: T[];
  last: T[];
  delta: T[];
}
export interface IExcluded {
  categoryIDs: string[];
  questionIDs: string[];
  beneficiaryIDs: string[];
}

export interface IJOCServiceReport {
  beneficiaryIDs: string[];
  questionAggregates: IJOCAggregates<IQuestionAggregates>;
  categoryAggregates: IJOCAggregates<ICategoryAggregates>;
  excluded?: IExcluded;
  warnings?: string[];
}

export interface ICommonROC {
  value: number;
  noRecords: number;
  reportCoverage: number;
}

export interface IQuestionROC extends ICommonROC {
  questionID: string;
}

export interface ICategoryROC extends ICommonROC {
  categoryID: string;
}

export interface IBeneficiaryROC {
  beneficiary: string;
  questionROCs: IQuestionROC[];
  categoryROCs: ICategoryROC[];
}

export interface IROCReport {
  beneficiaries: IBeneficiaryROC[];
  excluded: IExcluded;
  warnings: string[];
  tags: string[];
}

export const jocFragment = gql`
  fragment defaultJOCReport on JOCServiceReport {
    beneficiaryIDs,
    questionAggregates {
      first {
        questionID,
        value,
        beneficiaryIDs,
        warnings
      },
      last {
        questionID,
        value,
        beneficiaryIDs,
        warnings
      },
      delta {
        questionID,
        value,
        beneficiaryIDs,
        warnings
      }
    },
    categoryAggregates {
      first {
        categoryID,
        value,
        beneficiaryIDs,
        warnings
      },
      last {
        categoryID,
        value,
        beneficiaryIDs,
        warnings
      },
      delta {
        categoryID,
        value,
        beneficiaryIDs,
        warnings
      }
    },
    excluded{
      categoryIDs,
      questionIDs,
      beneficiaryIDs
    },
    warnings
  }`;

export const rocFragment  = gql`
  fragment defaultROCReport on ROCReport {
    beneficiaries{
      beneficiary,
      questionROCs {
        noRecords,
        reportCoverage,
        questionID,
        value
      },
      categoryROCs {
        noRecords,
        reportCoverage,
        categoryID,
        value
      },
    }
    warnings,
    excluded{
      questionIDs,
      beneficiaryIDs,
      categoryIDs
    },
    tags
  }`;
