import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import {IOutcomeSet} from 'models/outcomeSet';
import { List, Loader, Button, Popup } from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {ConfirmButton} from 'components/ConfirmButton';
import {CategoryPill} from 'components/CategoryPill';
import {EditLikertQuestion} from 'components/EditLikertQuestion';
const ReactGA = require('react-ga');
import './style.less';

interface IProps extends IQuestionMutation {
  data?: IOutcomeResult;
  outcomeSetID: string;
};

interface IState {
  newQuestionClicked?: boolean;
  editedQuestionId?: string;
};

class QuestionListInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewQuestionClicked = this.setNewQuestionClicked.bind(this);
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
      />
    );
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
          <CategoryPill outcomeSetID={this.props.outcomeSetID} questionID={q.id} />
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
            <NewLikertQuestion QuestionSetID={this.props.outcomeSetID} OnSuccess={this.setNewQuestionClicked(false)} />
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
const QuestionList = getOutcomeSet<IProps>((props) => props.outcomeSetID)(deleteQuestion<IProps>(QuestionListInner));
export { QuestionList }
