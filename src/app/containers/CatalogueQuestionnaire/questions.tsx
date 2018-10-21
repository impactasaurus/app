import * as React from 'react';
import {QuestionList} from 'components/QuestionList';
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

const QuestionsInner = (p: IProps) => {
  return (<QuestionList outcomeSetID={p.match.params.id} questionnaire={p.data.getCatalogueQuestionnaire}/>);
};

const InnerWithSpinner = ApolloLoaderHoC('loading questionnaire', (p: IProps) => p.data, QuestionsInner);
const InnerWithData = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(InnerWithSpinner);
export const Questions = InnerWithData;
