import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, addLikertQuestion, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import { Button, Input, List, Icon, Grid} from 'semantic-ui-react';
import './style.less';

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  editError?: string;
  newQuestionError?: string;
  deleteError?: string;
  newName?: string;
  newDescription?: string;
  newQuestion?: string;
  newClicked?: boolean;
};

class OutcomeSetInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      editError: undefined,
      newQuestionError: undefined,
      deleteError: undefined,
    };
    this.renderEditControl = this.renderEditControl.bind(this);
    this.editQS = this.editQS.bind(this);
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.setNewDescription = this.setNewDescription.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setNewClicked = this.setNewClicked.bind(this);
  }

  private editQS() {
    this.props.editQuestionSet(
      this.props.params.id,
      this.state.newName || this.props.data.getOutcomeSet.name,
      this.state.newDescription || this.props.data.getOutcomeSet.description,
    )
    .then(() => {
      this.setState({
        editError: undefined,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        editError: e.message,
      });
    });
  }

  private deleteQuestion(questionID: string) {
    return () => {
      this.props.deleteQuestion(this.props.params.id, questionID)
      .then(() => {
        this.setState({
          deleteError: undefined,
        });
      })
      .catch((e: Error)=> {
        this.setState({
          deleteError: e.message,
        });
      });
    };
  }

  private addQuestion() {
    this.props.addLikertQuestion(this.props.params.id, this.state.newQuestion, 10)
    .then(() => {
      console.log('tere');
      this.setState({
        newQuestionError: undefined,
        newClicked: false,
      });
    })
    .catch((e: Error)=> {
      this.setState({
        newQuestionError: e.message,
      });
    });
  }

  private setNewName(_, data) {
    this.setState({
      newName: data.value,
    });
  }

  private setNewDescription(_, data) {
    this.setState({
      newDescription: data.value,
    });
  }

  private setNewQuestion(_, data) {
    this.setState({
      newQuestion: data.value,
    });
  }

  private setNewClicked() {
    this.setState({
      newClicked: true,
    });
  }

  private renderEditControl(): JSX.Element {
    return (
      <div>
        <Input type="text" placeholder="Name" onChange={this.setNewName} defaultValue={this.props.data.getOutcomeSet.name}/>
        <Input type="text" placeholder="Description" onChange={this.setNewDescription} defaultValue={this.props.data.getOutcomeSet.description}/>
        <Button onClick={this.editQS}>Edit</Button>
        <p>{this.state.editError}</p>
      </div>
    );
  }

  private renderQuestion(q: Question): JSX.Element {
    return (
      <List.Item className="question" key={q.id}>
        <List.Content floated="right">
          <Button icon onClick={this.deleteQuestion(q.id)}>
            <Icon name="delete" />
          </Button>
          <p>{this.state.deleteError}</p>
        </List.Content>
        <List.Content>{q.question}</List.Content>
      </List.Item>
    );
  }

  private renderNewQuestionControl(): JSX.Element {
    if (this.state.newClicked === true) {
      return (
        <List.Item className="new-control">
          <List.Content>
            <Input type="text" placeholder="Question" onChange={this.setNewQuestion}/>
            <Button onClick={this.addQuestion}>Add</Button>
            <p>{this.state.newQuestionError}</p>
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item className="new-control">
          <List.Content onClick={this.setNewClicked}>
            <List.Header as="a">New Question</List.Header>
          </List.Content>
        </List.Item>
      );
    }
  }

  public render() {
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <Grid container columns={1} id="question-set">
        <Grid.Column>
          <h1>{os.name}</h1>
          <h3>{os.description}</h3>
          {this.renderEditControl()}
          <List divided relaxed verticalAlign="middle" className="list">
            {renderArray(this.renderQuestion, os.questions)}
            {this.renderNewQuestionControl()}
          </List>
        </Grid.Column>
      </Grid>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(editQuestionSet(addLikertQuestion(deleteQuestion(OutcomeSetInner))));
export { OutcomeSet }
