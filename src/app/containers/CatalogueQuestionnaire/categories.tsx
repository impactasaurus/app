import * as React from 'react';
import {CategoryList} from 'components/CategoryList';
import {Message, Icon} from 'semantic-ui-react';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from '../../apollo/modules/catalogue';
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
      <CategoryList outcomeSetID={p.match.params.id} data={p.data}/>
    </div>
  );
};

export const Categories = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(CategoriesInner);
