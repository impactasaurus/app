import * as React from 'react';
import {IOutcomeResult, getOutcomeSet, IOutcomeMutation, editQuestionSet} from 'apollo/modules/outcomeSets';
import {IQuestionMutation, addLikertQuestion, deleteQuestion} from 'apollo/modules/questions';
import {renderArray} from 'helpers/react';
import {Question} from 'models/question';
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
};

class OutcomeSetInner extends React.Component<IProps, IState> {

  private newName: React.HTMLAttributes<string>;
  private newDescription: React.HTMLAttributes<string>;
  private newQuestion: React.HTMLAttributes<string>;

  constructor(props) {
    super(props);
    this.state = {
      editError: undefined,
      newQuestionError: undefined,
      deleteError: undefined,
    };
    this.renderEditControl = this.renderEditControl.bind(this);
    this.setRef = this.setRef.bind(this);
    this.editQS = this.editQS.bind(this);
    this.renderNewQuestionControl = this.renderNewQuestionControl.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  private setRef(attrName: string) {
    return (input) => {this[attrName] = input;};
  }

  private editQS() {
    this.props.editQuestionSet(this.props.params.id, this.newName.value as string, this.newDescription.value as string)
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
    this.props.addLikertQuestion(this.props.params.id, this.newQuestion.value as string, 10)
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

  private renderEditControl(): JSX.Element {
    return (
      <div>
        <input type="text" placeholder="Name" ref={this.setRef('newName')}/>
        <input type="text" placeholder="Description" ref={this.setRef('newDescription')}/>
        <button onClick={this.editQS}>Edit</button>
        <p>{this.state.editError}</p>
      </div>
    );
  }

  private renderQuestion(q: Question): JSX.Element {
    return (
      <div key={q.id} className={style.Question}>
        <p>question: {q.question}</p>
        <button onClick={this.deleteQuestion(q.id)}>Delete</button>
        <p>{this.state.deleteError}</p>
      </div>
    );
  }

  private renderNewQuestionControl(): JSX.Element {
    return (
      <div>
        <input type="text" placeholder="Question" ref={this.setRef('newQuestion')}/>
        <button onClick={this.addQuestion}>Add</button>
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
