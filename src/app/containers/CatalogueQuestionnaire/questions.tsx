import * as React from 'react';
import {QuestionList} from 'components/QuestionList';
import {getCatalogueQuestionnaire, ICatalogueQuestionnaire} from '../../apollo/modules/catalogue';

interface IProps {
  data: ICatalogueQuestionnaire;
  match: {
    params: {
      id: string,
    },
  };
}

const QuestionsInner = (p: IProps) => {
  return (<QuestionList outcomeSetID={p.match.params.id} data={p.data}/>);
};

export const Questions = getCatalogueQuestionnaire<IProps>((props) => props.match.params.id)(QuestionsInner);
