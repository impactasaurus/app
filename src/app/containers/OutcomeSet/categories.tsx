import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {CategoryList} from 'components/CategoryList';
import {Message, Icon} from 'semantic-ui-react';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
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
      <CategoryList outcomeSetID={p.match.params.id} questionnaire={p.data.getOutcomeSet}/>
    </div>
  );
};

const InnerWithSpinner = ApolloLoaderHoC('questionnaire', (p: IProps) => p.data, CategoriesInner);
const InnerWithData = getOutcomeSet<IProps>((props) => props.match.params.id)(InnerWithSpinner);
export const Categories = InnerWithData;
