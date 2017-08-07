import * as React from 'react';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import { List, Icon, Loader } from 'semantic-ui-react';
import {NewLikertQuestion} from 'components/NewLikertQuestion';
import {ConfirmButton} from 'components/ConfirmButton';

interface IProps extends IQuestionMutation {
  data?: IOutcomeResult;
  outcomeSetID: string;
};

interface IState {
  deleteQuestionError?: string;
  newQuestionClicked?: boolean;
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

  private deleteQuestion(questionID: string) {
    return () => {
      this.props.deleteQuestion(this.props.outcomeSetID, questionID)
      .then(() => {
        this.setState({
          deleteQuestionError: undefined,
        });
      })
      .catch((e: Error)=> {
        this.setState({
          deleteQuestionError: e.message,
        });
      });
    };
  }

  private setNewQuestionClicked(newValue: boolean): ()=>void {
    return () => {
      this.setState({
        newQuestionClicked: newValue,
      });
    };
  }

  private renderQuestion(q: Question): JSX.Element {
    let descripton = '';
    if (q.minLabel || q.maxLabel) {
      descripton = `${q.minLabel} > ${q.maxLabel}`;
    }
    return (
      <List.Item className="question" key={q.id}>
        <List.Content floated="right">
          <ConfirmButton onConfirm={this.deleteQuestion(q.id)} promptText="Are you sure you want to archive this question?" buttonProps={{icon: true, size: 'mini'}} tooltip="Archive">
            <Icon name="archive"/>
          </ConfirmButton>
          <p>{this.state.deleteQuestionError}</p>
        </List.Content>
        <List.Header>{q.question}</List.Header>
        <List.Description>{descripton}</List.Description>
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
      <List divided relaxed verticalAlign="middle" className="list">
        {renderArray(this.renderQuestion, os.questions.filter((q) => !q.archived))}
        {this.renderNewQuestionControl()}
      </List>
    );
  }
}
const QuestionList = getOutcomeSet<IProps>((props) => props.outcomeSetID)(deleteQuestion<IProps>(QuestionListInner));
export { QuestionList }
