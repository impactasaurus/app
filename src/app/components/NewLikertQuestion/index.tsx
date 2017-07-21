import * as React from 'react';
import { Button, Input } from 'semantic-ui-react';
import {IQuestionMutation, addLikertQuestion} from 'apollo/modules/questions';

interface IProps extends IQuestionMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
}

interface IState {
  newQuestionError?: string;
  newQuestion?: string;
  minLabel?: string;
  maxLabel?: string;
}

class NewLikertQuestionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.addQuestion = this.addQuestion.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setMinLabel = this.setMinLabel.bind(this);
    this.setMaxLabel = this.setMaxLabel.bind(this);
  }

  private addQuestion() {
    this.props.addLikertQuestion(this.props.QuestionSetID, this.state.newQuestion, 10, this.state.minLabel, this.state.maxLabel)
    .then(() => {
      this.props.OnSuccess();
    })
    .catch((e: Error)=> {
      this.setState({
        newQuestionError: e.message,
      });
    });
  }

  private setNewQuestion(_, data) {
    this.setState({
      newQuestion: data.value,
    });
  }

  private setMinLabel(_, data) {
    this.setState({
      minLabel: data.value,
    });
  }

  private setMaxLabel(_, data) {
    this.setState({
      maxLabel: data.value,
    });
  }

  public render() {
    return (
      <div>
        <Input type="text" placeholder="Question" onChange={this.setNewQuestion}/>
        <Button onClick={this.addQuestion}>Add</Button>
        <p>{this.state.newQuestionError}</p>
      </div>
    );
  }
}

const NewLikertQuestion = addLikertQuestion<IProps>(NewLikertQuestionInner);
export { NewLikertQuestion };
