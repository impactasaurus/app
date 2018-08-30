import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {CategoryList} from 'components/CategoryList';

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

const CategoriesInner = (p: IProps) => {
  return (<CategoryList outcomeSetID={p.match.params.id} data={p.data}/>);
};

export const Categories = getOutcomeSet<IProps>((props) => props.match.params.id)(CategoriesInner);
