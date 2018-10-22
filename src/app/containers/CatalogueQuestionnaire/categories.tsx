import * as React from 'react';
import {CategoryList} from 'components/CategoryList';
import {Message, Icon} from 'semantic-ui-react';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from '../../apollo/modules/catalogue';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
const strings = require('./../../../strings.json');

interface IProps {
  data: ICatalogueQuestionnaire;
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
      <CategoryList outcomeSetID={p.match.params.id} questionnaire={p.data.getCatalogueQuestionnaire} readOnly={true}/>
    </div>
  );
};

const InnerWithSpinner = ApolloLoaderHoC('questionnaire', (p: IProps) => p.data, CategoriesInner);
const InnerWithData = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(InnerWithSpinner);
export const Categories = InnerWithData;
