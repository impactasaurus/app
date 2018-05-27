import * as React from 'react';
import {IOutcomeResult} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import { List, Loader, Button, Popup } from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {ConfirmButton} from 'components/ConfirmButton';
import {CategoryPill} from 'components/CategoryPill';
import {EditLikertQuestion} from 'components/EditLikertQuestion';
import './style.less';
import {isNullOrUndefined} from 'util';
const ReactGA = require('react-ga');

interface IProps extends IQuestionMutation {
  data: IOutcomeResult;
  outcomeSetID: string;
}

interface IState {
  newQuestionClicked?: boolean;
  editedQuestionId?: string;
  categoryClasses?: {[catID: string]: string};
}

function assignCategoriesClasses(current: {[catID: string]: string}, data: IOutcomeResult): {[catID: string]: string} {
  const assignments = Object.assign({}, current);
  if (isNullOrUndefined(data.getOutcomeSet) || !Array.isArray(data.getOutcomeSet.questions)) {
    return assignments;
  }
  data.getOutcomeSet.questions.forEach((q: Question) => {
    if (isNullOrUndefined(q.categoryID)) {
      return;
    }
    const assignment = assignments[q.categoryID];
    if (!isNullOrUndefined(assignment)) {
      return;
    }
    const noAssigned = Object.keys(assignments).length;
    assignments[q.categoryID] = `col-${noAssigned % 5}`;
  });
  return assignments;
}

class QuestionListInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      categoryClasses: assignCategoriesClasses({}, this.props.data),
    };
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewQuestionClicked = this.setNewQuestionClicked.bind(this);
    this.getCategoryPillClass = this.getCategoryPillClass.bind(this);
  }

  public componentWillUpdate(nextProps: IProps) {
    const currentAssignment = this.state.categoryClasses;
    const newAssignments = assignCategoriesClasses(currentAssignment, nextProps.data);
    if (Object.keys(newAssignments).length !== Object.keys(currentAssignment).length) {
      this.setState({
        ...this.state,
        categoryClasses: newAssignments,
      });
    }
  }

  private logQuestionDeletedGAEvent() {
    ReactGA.event({
        category: 'question',
        action: 'deleted',
        label: 'likert',
    });
  }

  private deleteQuestion(questionID: string) {
    return (): Promise<IOutcomeSet> => {
      this.logQuestionDeletedGAEvent();
      return this.props.deleteQuestion(this.props.outcomeSetID, questionID);
    };
  }

  private setNewQuestionClicked(newValue: boolean): ()=>void {
    return () => {
      this.setState({
        newQuestionClicked: newValue,
      });
    };
  }

  private setEditedQuestionId(questionId: string): ()=>void {
    return () => {
      this.setState({
        editedQuestionId: questionId,
      });
    };
  }

  private getQuestionDescription(q: Question): string {
    const description = q.description || '';

    if (q.leftLabel || q.rightLabel) {
      if (description) {
        return `${description} (${q.leftLabel} > ${q.rightLabel})`;
      }
      return `${q.leftLabel} > ${q.rightLabel}`;
    }
    return description;
  }

  private renderEditQuestionForm(q: Question): JSX.Element {
    return (
      <EditLikertQuestion
        key={q.id}
        question={q}
        QuestionSetID={this.props.outcomeSetID}
        OnSuccess={this.setEditedQuestionId(null)}
        OnCancel={this.setEditedQuestionId(null)}
      />
    );
  }

  private getCategoryPillClass(catID?: string): string|undefined {
    return (isNullOrUndefined(catID)) ? undefined : this.state.categoryClasses[catID];
  }

  private renderQuestion(q: Question): JSX.Element {
    const description = this.getQuestionDescription(q);

    if (this.state.editedQuestionId && this.state.editedQuestionId === q.id) {
      return this.renderEditQuestionForm(q);
    }

    const editButton = <Button onClick={this.setEditedQuestionId(q.id)} icon="edit" tooltip="Edit" compact size="tiny" />;

    return (
      <List.Item className="question" key={q.id}>
        <List.Content floated="right" verticalAlign="middle">
          <CategoryPill outcomeSetID={this.props.outcomeSetID} questionID={q.id} cssClass={this.getCategoryPillClass(q.categoryID)} data={this.props.data}/>
          <Popup trigger={editButton} content="Edit" />
          <ConfirmButton onConfirm={this.deleteQuestion(q.id)} promptText="Are you sure you want to archive this question?" buttonProps={{icon: 'archive', compact:true, size:'tiny'}} tooltip="Archive" />
        </List.Content>
        <List.Content verticalAlign="middle">
          <List.Header>{q.question}</List.Header>
          <List.Description>{description}</List.Description>
        </List.Content>
      </List.Item>
    );
  }

  private renderNewQuestionControl(): JSX.Element {
    if (this.state.newQuestionClicked === true) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <NewLikertQuestion
              QuestionSetID={this.props.outcomeSetID}
              OnSuccess={this.setNewQuestionClicked(false)}
              OnCancel={this.setNewQuestionClicked(false)} />
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewQuestionClicked(true)}>
            <List.Header as="a">New Question</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  public render() {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <List divided relaxed verticalAlign="middle" className="list question">
        {renderArray(this.renderQuestion, os.questions.filter((q) => !q.archived))}
        {this.renderNewQuestionControl()}
      </List>
    );
  }
}
const QuestionList = deleteQuestion<IProps>(QuestionListInner);
export { QuestionList }
