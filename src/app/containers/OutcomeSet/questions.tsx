import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {QuestionList} from 'components/QuestionList';

interface IProps {
  data: IOutcomeResult;
  match: {
    params: {
      id: string,
    },
  };
}

const QuestionsInner = (p: IProps) => {
  return (<QuestionList outcomeSetID={p.match.params.id} data={p.data}/>);
};

export const Questions = getOutcomeSet<IProps>((props) => props.match.params.id)(QuestionsInner);
