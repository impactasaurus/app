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

export interface IAnswerDelta {
  aID: string;
  stats: IDelta;
}

export interface IBenDeltaSummary extends IID {
  questions: IAnswerDelta[];
  categories: IAnswerDelta[];
}

export interface IBeneficiaryDeltaReport {
  beneficiaries: IBenDeltaSummary[];
  categories: IID[];
  excluded: IExclusion[];
}

export const beneficiaryDeltaFragment = gql`
  fragment beneficiaryDeltaFragment on Report {
    beneficiaries {
      id,
      categories {
        aID: id,
        stats {
          delta
        }
      }
      questions {
        aID: id,
        stats {
          delta
        }
      }
    },
    categories {
      id
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

export const latestAggregationFragment = gql`
  fragment latestAggregationFragment on Report {
    beneficiaries {
      id
    },
    questions {
      id,
      latest
    },
    categories {
      id,
      latest
    },
    excluded {
      beneficiary,
      question,
      category,
      reason
    }
  }`;

  export interface ILatestAggregation extends IID {
    latest: number;
  }

  export interface ILatestAggregationReport {
    beneficiaries: IID[];
    questions: ILatestAggregation[];
    categories: ILatestAggregation[];
    excluded: IExclusion[];
  }
