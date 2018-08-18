import * as React from 'react';
import {getQuestions} from 'helpers/questionnaire';
import {renderArray} from 'helpers/react';
import {IOutcomeResult} from 'apollo/modules/outcomeSets';
import {Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import {ListItem} from './ListItem';
import { List as SemanticUIList } from 'semantic-ui-react';
import {SortableContainer} from 'react-sortable-hoc';

interface IProps {
  data: IOutcomeResult;
  outcomeSetID: string;
  editedQuestionID: string;

  getCategoryPillClass(catID?: string): string|undefined;
  deleteQuestion(questionID: string): () => Promise<IOutcomeSet>;
  setEditedQuestionId(questionId: string): ()=>void;

  renderEditQuestionForm: (q: Question) => JSX.Element;
  newQuestionControl: JSX.Element;
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
        data={this.props.data}
        categoryPillStyle={this.props.getCategoryPillClass(q.categoryID)}
        deleteQuestion={this.props.deleteQuestion(q.id)}
        editQuestion={this.props.setEditedQuestionId(q.id)}
        outcomeSetID={this.props.outcomeSetID}
        question={q}
        index={idx}
        draggable={draggable}
        disabled={!draggable}
      />
    );
  }

  public render() {
    const os = this.props.data.getOutcomeSet;
    if (os === undefined) {
      return (<div />);
    }
    return (
      <SemanticUIList divided={true} relaxed={true} verticalAlign="middle" className="list question">
        {renderArray(this.renderQuestion, getQuestions(os))}
        {this.props.newQuestionControl}
      </SemanticUIList>
    );
  }
}

export const List = SortableContainer(ListInner);
