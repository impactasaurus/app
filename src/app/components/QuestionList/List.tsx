import * as React from 'react';
import {getQuestions} from 'helpers/questionnaire';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import {ListItem} from './ListItem';
import { List as SemanticUIList } from 'semantic-ui-react';
import {SortableContainer} from 'react-sortable-hoc';

interface IProps {
  questionnaire: IOutcomeSet;
  outcomeSetID: string;
  editedQuestionID: string;
  readOnly?: boolean; // defaults to false

  getCategoryPillClass(catID?: string): string|undefined;
  deleteQuestion(questionID: string): () => Promise<IOutcomeSet>;
  setEditedQuestionId(questionId: string): ()=>void;

  renderEditQuestionForm: (q: Question) => JSX.Element;
  newQuestionControl: JSX.Element;

  className?: string;
}

const ListInner = (p: IProps) => {

  const renderQuestion = (q: Question, idx: number) => {
    if (p.editedQuestionID && p.editedQuestionID === q.id) {
      return p.renderEditQuestionForm(q);
    }

    const draggable = !(p.editedQuestionID !== undefined && p.editedQuestionID !== null);

    return (
      <ListItem
        key={q.id}
        questionnaire={p.questionnaire}
        categoryPillStyle={p.getCategoryPillClass(q.categoryID)}
        deleteQuestion={p.deleteQuestion(q.id)}
        editQuestion={p.setEditedQuestionId(q.id)}
        outcomeSetID={p.outcomeSetID}
        readOnly={p.readOnly}
        question={q}
        index={idx}
        draggable={draggable}
        disabled={!draggable}
      />
    );
  }

  if (p.questionnaire === undefined) {
    return (<div />);
  }
  return (
    <SemanticUIList divided={true} relaxed={true} verticalAlign="middle" className={p.className+' list question'}>
      {renderArray(renderQuestion, getQuestions(p.questionnaire))}
      {p.readOnly !== true && p.newQuestionControl}
    </SemanticUIList>
  );
}

export const List = SortableContainer(ListInner);
