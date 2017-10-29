import * as React from 'react';
import { Button, ButtonProps, Message, Input } from 'semantic-ui-react';
import { Likert} from 'components/Likert';
import {IOutcomeSet} from 'models/outcomeSet';
import './style.less';
import {ILikertQuestionForm} from 'models/question';
const ReactGA = require('react-ga');

interface IProps  {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  onSubmitButtonClick: (question: ILikertQuestionForm)=>Promise<IOutcomeSet>;
  edit?: boolean;
  newQuestion?: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: number;
  rightValue?: number;
  submitButtonText: string;
}

interface IState {
  newQuestionError?: string;
  newQuestion?: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
  saving?: boolean;
}

class LikertQuestionForm extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      newQuestion: this.props.newQuestion || '',
      description: this.props.description || '',
      leftLabel: this.props.leftLabel || '',
      rightLabel: this.props.rightLabel || '',
      leftValue: this.props.leftValue ? this.props.leftValue.toString() : '0',
      rightValue: this.props.rightValue ? this.props.rightValue.toString() : '10',
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setLeftLabel = this.setLeftLabel.bind(this);
    this.setRightLabel = this.setRightLabel.bind(this);
    this.setLeftValue = this.setLeftValue.bind(this);
    this.setRightValue = this.setRightValue.bind(this);
  }

  private isInt(str: string): boolean {
    const n = Number(str);
    const i = Math.floor(n);
    return !Number.isNaN(i) && i === n;
  }

  private leftValueInt = (s: IState) => parseInt(s.leftValue, 10);
  private rightValueInt = (s: IState) => parseInt(s.rightValue, 10);
  private noop = () => {};

  private logQuestionCreatedGAEvent() {
    ReactGA.event({
      category: 'question',
      action: 'created',
      label: 'likert',
    });
  }

  private onSubmitButtonClick() {
    if (typeof this.state.newQuestion !== 'string' || this.state.newQuestion.length === 0) {
      this.setState({
        newQuestionError: 'The question text must be provided',
      });
      return;
    }
    if (!this.isInt(this.state.leftValue) || !this.isInt(this.state.rightValue)) {
      this.setState({
        newQuestionError: 'The left and right values must be whole integers',
      });
      return;
    }
    const lv = this.leftValueInt(this.state);
    const rv = this.rightValueInt(this.state);
    if (lv === rv) {
      this.setState({
        newQuestionError: 'The left and right values cannot be equal',
      });
      return;
    }
    this.setState({
      saving: true,
    });

    this.props.onSubmitButtonClick({
      question: this.state.newQuestion,
      minValue: lv,
      maxValue: rv,
      minLabel: this.state.leftLabel,
      maxLabel: this.state.rightLabel,
      description: this.state.description,
    })
      .then(() => {
        this.logQuestionCreatedGAEvent();
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

  private setDescription(_, data) {
    this.setState({
      description: data.value,
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

  private setLeftValue(_, data) {
    this.setState({
      leftValue: data.value,
    });
  }

  private setRightValue(_, data) {
    this.setState({
      rightValue: data.value,
    });
  }

  public render() {
    const addProps: ButtonProps = {};
    if (this.state.saving) {
      addProps.loading = true;
      addProps.disabled = true;
    }
    return (
      <Message>
        <Message.Content>
          <Message.Header>New Likert Question</Message.Header>
          <div className="new-likert-form">
            <div className="section upper">
              <Input className="full" autoFocus type="text" placeholder="Question" onChange={this.setNewQuestion} value={this.state.newQuestion} />
            </div>
            <div className="section upper">
              <Input className="full" type="text" placeholder="Description (optional)" onChange={this.setDescription} value={this.state.description} />
            </div>
            <div className="section mid">
              <Input className="left" type="text" placeholder="Left Label (optional)" onChange={this.setLeftLabel} value={this.state.leftLabel} />
              <Input className="right" type="text" placeholder="Right Label (optional)" onChange={this.setRightLabel} value={this.state.rightLabel} />
            </div>
            <div className="section likert">
              <Likert
                leftValue={this.leftValueInt(this.state)}
                rightValue={this.rightValueInt(this.state)}
                onChange={this.noop}
                disabled={true} />
            </div>
            <div className="section lower">
              <Input className="left" type="number" placeholder="Left Value" onChange={this.setLeftValue} defaultValue={this.state.leftValue} disabled={this.props.edit} />
              <Input className="right" type="number" placeholder="Right Value" onChange={this.setRightValue} defaultValue={this.state.rightValue} disabled={this.props.edit} />
            </div>
            <div className="controls">
              <Button {...addProps} onClick={this.onSubmitButtonClick}>{this.props.submitButtonText}</Button>
              <p>{this.state.newQuestionError}</p>
            </div>
          </div>
        </Message.Content>
      </Message>
    );
  }
}

export { LikertQuestionForm };
