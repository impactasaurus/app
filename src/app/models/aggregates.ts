import gql from 'graphql-tag';

export interface ICategoryAggregate {
  categoryID: string;
  value: number;
}

export interface IAggregates {
  category: ICategoryAggregate[];
}

export const fragment = gql`
  fragment defaultAggregates on Aggregates {
    category {
      value,
      categoryID
    }
  }`;
