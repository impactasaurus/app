import * as React from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import {Input} from 'components/Input';
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
  saving?: boolean;
}

class NewLikertQuestionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
    };
    this.addQuestion = this.addQuestion.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setLeftLabel = this.setLeftLabel.bind(this);
    this.setRightLabel = this.setRightLabel.bind(this);
  }

  private addQuestion() {
    if (typeof this.state.newQuestion !== 'string' || this.state.newQuestion.length === 0) {
      this.setState({
        newQuestionError: 'The question text must be provided',
      });
      return;
    }
    this.setState({
      saving: true,
    });
    this.props.addLikertQuestion(this.props.QuestionSetID, this.state.newQuestion, 10, this.state.leftLabel, this.state.rightLabel)
    .then(() => {
      this.setState({
        saving: false,
      });
      this.props.OnSuccess();
    })
    .catch((e: Error)=> {
      this.setState({
        newQuestionError: e.message,
        saving: false,
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
    const addProps: ButtonProps = {};
    if (this.state.saving) {
      addProps.loading = true;
      addProps.disabled = true;
    }
    return (
      <div>
        <Input autofocus type="text" placeholder="Question" onChange={this.setNewQuestion} />
        <Input type="text" placeholder="Left Label" onChange={this.setLeftLabel} />
        <Input type="text" placeholder="Right Label" onChange={this.setRightLabel} />
        <Button {...addProps} onClick={this.addQuestion}>Add</Button>
        <p>{this.state.newQuestionError}</p>
      </div>
    );
  }
}

const NewLikertQuestion = addLikertQuestion<IProps>(NewLikertQuestionInner);
export { NewLikertQuestion };
