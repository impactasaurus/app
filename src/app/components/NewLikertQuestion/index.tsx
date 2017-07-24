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
  leftLabel?: string;
  rightLabel?: string;
}

class NewLikertQuestionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.addQuestion = this.addQuestion.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setLeftLabel = this.setLeftLabel.bind(this);
    this.setRightLabel = this.setRightLabel.bind(this);
  }

  private addQuestion() {
    this.props.addLikertQuestion(this.props.QuestionSetID, this.state.newQuestion, 10, this.state.leftLabel, this.state.rightLabel)
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

  private setLeftLabel(_, data) {
    this.setState({
      leftLabel: data.value,
    });
  }

  private setRightLabel(_, data) {
    this.setState({
      rightLabel: data.value,
    });
  }

  public render() {
    return (
      <div>
        <Input type="text" placeholder="Question" onChange={this.setNewQuestion} />
        <Input type="text" placeholder="Left Label" onChange={this.setLeftLabel}/>
        <Input type="text" placeholder="Right Label" onChange={this.setRightLabel}/>
        <Button onClick={this.addQuestion}>Add</Button>
        <p>{this.state.newQuestionError}</p>
      </div>
    );
  }
}

const NewLikertQuestion = addLikertQuestion<IProps>(NewLikertQuestionInner);
export { NewLikertQuestion };
