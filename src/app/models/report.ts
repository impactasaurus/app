import {gql} from 'react-apollo';

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

export const fragment = gql`
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
