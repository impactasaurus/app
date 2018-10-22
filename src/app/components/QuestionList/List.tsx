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

class ListInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderQuestion = this.renderQuestion.bind(this);
  }

  private renderQuestion(q: Question, idx: number) {
    if (this.props.editedQuestionID && this.props.editedQuestionID === q.id) {
      return this.props.renderEditQuestionForm(q);
    }

    const draggable = !(this.props.editedQuestionID !== undefined && this.props.editedQuestionID !== null);

    return (
      <ListItem
        key={q.id}
        questionnaire={this.props.questionnaire}
        categoryPillStyle={this.props.getCategoryPillClass(q.categoryID)}
        deleteQuestion={this.props.deleteQuestion(q.id)}
        editQuestion={this.props.setEditedQuestionId(q.id)}
        outcomeSetID={this.props.outcomeSetID}
        readOnly={this.props.readOnly}
        question={q}
        index={idx}
        draggable={draggable}
        disabled={!draggable}
      />
    );
  }

  public render() {
    if (this.props.questionnaire === undefined) {
      return (<div />);
    }
    return (
      <SemanticUIList divided={true} relaxed={true} verticalAlign="middle" className={this.props.className+' list question'}>
        {renderArray(this.renderQuestion, getQuestions(this.props.questionnaire))}
        {this.props.readOnly !== true && this.props.newQuestionControl}
      </SemanticUIList>
    );
  }
}

export const List = SortableContainer(ListInner);
