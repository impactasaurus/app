import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {CategoryList} from 'components/CategoryList';
import {Message, Icon} from 'semantic-ui-react';
const strings = require('./../../../strings.json');

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

const CategoriesInner = (p: IProps) => {
  return (
    <div>
      <Message info={true}>
        <Icon name="question" />
        {strings.questionCategoryExplanation}
      </Message>
      <CategoryList outcomeSetID={p.match.params.id} data={p.data}/>
    </div>
  );
};

export const Categories = getOutcomeSet<IProps>((props) => props.match.params.id)(CategoriesInner);
