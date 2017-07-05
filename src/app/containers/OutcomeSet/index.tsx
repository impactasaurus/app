import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, addLikertQuestion, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
import { Button, Input } from 'semantic-ui-react';
const style = require('./style.css');

interface IProps extends IOutcomeMutation, IQuestionMutation {
  data: IOutcomeResult;
  params: {
      id: string,
  };
};

interface IState {
  editError: string;
  newQuestionError: string;
  deleteError: string;
  newName?: string;
  newDescription?: string;
  newQuestion?: string;
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
  }

  private editQS() {
    this.props.editQuestionSet(this.props.params.id, this.state.newName, this.state.newDescription)
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
      this.setState({
        newQuestionError: undefined,
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

  private renderEditControl(): JSX.Element {
    return (
      <div>
        <Input type="text" placeholder="Name" onChange={this.setNewName}/>
        <Input type="text" placeholder="Description" onChange={this.setNewDescription}/>
        <Button onClick={this.editQS}>Edit</Button>
        <p>{this.state.editError}</p>
      </div>
    );
  }

  private renderQuestion(q: Question): JSX.Element {
    return (
      <div key={q.id} className={style.Question}>
        <p>question: {q.question}</p>
        <Button onClick={this.deleteQuestion(q.id)}>Delete</Button>
        <p>{this.state.deleteError}</p>
      </div>
    );
  }

  private renderNewQuestionControl(): JSX.Element {
    return (
      <div>
        <Input type="text" placeholder="Question" onChange={this.setNewQuestion}/>
        <Button onClick={this.addQuestion}>Add</Button>
        <p>{this.state.newQuestionError}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    const os = data.getOutcomeSet;
    if (os === undefined) {
        return (<div />);
    }
    return (
      <div className={style.Home}>
        <p>name: {os.name}</p>
        <p>description: {os.description}</p>
        {this.renderEditControl()}
        <hr />
        <h2>Questions</h2>
        <div>
          {renderArray(this.renderQuestion, os.questions)}
        </div>
        {this.renderNewQuestionControl()}
      </div>
    );
  }
}
const OutcomeSet = getOutcomeSet<IProps>((props) => props.params.id)(editQuestionSet(addLikertQuestion(deleteQuestion(OutcomeSetInner))));
export { OutcomeSet }
