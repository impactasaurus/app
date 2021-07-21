import { gql } from "react-apollo";

export interface IDelta {
  delta: number;
}

export interface IID {
  id: string;
}

export interface value {
  value: number;
}

export interface IAnswerTimestampedDistance extends IID {
  initial: value;
  latest: value;
}

export interface IAnswerDistance extends IID {
  initial: number;
  latest: number;
}

export interface IBenDistance extends IID {
  questions: IAnswerTimestampedDistance[];
  categories: IAnswerTimestampedDistance[];
}

export interface IExclusion {
  beneficiary?: string;
  question?: string;
  category?: string;
  reason: string;
}

export interface IAnswerAggregationReport {
  beneficiaries: IBenDistance[];
  questions: IAnswerDistance[];
  categories: IAnswerDistance[];
  excluded: IExclusion[];
}

export const answerAggregationFragment = gql`
  fragment answerAggregationFragment on Report {
    beneficiaries {
      id
      categories {
        id
        initial {
          value
        }
        latest {
          value
        }
      }
      questions {
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
      id
      categories {
        aID: id
        stats {
          delta
        }
      }
      questions {
        aID: id
        stats {
          delta
        }
      }
    }
    categories {
      id
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

export const latestAggregationFragment = gql`
  fragment latestAggregationFragment on Report {
    beneficiaries {
      id
      categories {
        id
        initial {
          value
        }
        latest {
          value
        }
      }
      questions {
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
      latest
    }
    categories {
      id
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

export interface ILatestAggregation extends IID {
  latest: number;
}

export interface ILatestAggregationReport {
  beneficiaries: IBenDistance[];
  questions: ILatestAggregation[];
  categories: ILatestAggregation[];
  excluded: IExclusion[];
}
