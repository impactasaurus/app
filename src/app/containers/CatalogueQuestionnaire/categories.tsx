import * as React from 'react';
import {CategoryList} from 'components/CategoryList';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from '../../apollo/modules/catalogue';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';

interface IProps {
  data: ICatalogueQuestionnaire;
  match: {
    params: {
      id: string,
    },
  };
}

const CategoriesInner = (p: IProps) => <CategoryList outcomeSetID={p.match.params.id} questionnaire={p.data.getCatalogueQuestionnaire.outcomeset} readOnly={true}/>;

const InnerWithSpinner = ApolloLoaderHoC('questionnaire', (p: IProps) => p.data, CategoriesInner);
const InnerWithData = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(InnerWithSpinner);
export const Categories = InnerWithData;
