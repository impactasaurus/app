import {gql} from 'react-apollo';

export interface IDelta {
  delta: number;
}

export interface IID {
  id: string;
}

export interface IExclusion {
  beneficiary?: string;
  question?: string;
  category?: string;
  reason: string;
}

export interface IAnswerAggregation extends IID {
  initial: number;
  latest: number;
  stats: IDelta;
}

export interface IAnswerAggregationReport {
  beneficiaries: IID[];
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
        delta
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

export interface IAnswerDelta extends IID {
  stats: IDelta;
}

export interface IBenDeltaSummary extends IID {
  questions: IAnswerDelta[];
  categories: IAnswerDelta[];
}

export interface IBeneficiaryDeltaReport {
  beneficiaries: IBenDeltaSummary[];
  excluded: IExclusion[];
}

export const beneficiaryDeltaFragment = gql`
  fragment beneficiaryAggregationFragment on Report {
    beneficiaries {
      id,
      categories {
        id,
        stats {
          delta
        }
      }
      questions {
        id,
        stats {
          delta
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
