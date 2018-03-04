import gql from 'graphql-tag';

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
