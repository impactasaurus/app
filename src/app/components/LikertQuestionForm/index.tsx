import * as React from 'react';
import { Button, ButtonProps, Message, Input, Select } from 'semantic-ui-react';
import { Likert } from 'components/Likert';
import {IOutcomeSet} from 'models/outcomeSet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import './style.less';
import {ILikertQuestionForm} from 'models/question';
const ReactGA = require('react-ga');

interface IProps  {
  QuestionSetID: string;
  data?: IOutcomeResult;
  OnSuccess: ()=>void;
  onSubmitButtonClick: (question: ILikertQuestionForm)=>Promise<IOutcomeSet>;
  edit?: boolean;
  newQuestion?: string;
  categoryID?: string;
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
  categoryID?: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
  saving?: boolean;
}

class LikertQuestionFormInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      newQuestion: this.props.newQuestion || '',
      categoryID: this.props.categoryID || null,
      description: this.props.description || '',
      leftLabel: this.props.leftLabel || '',
      rightLabel: this.props.rightLabel || '',
      leftValue: this.props.leftValue ? this.props.leftValue.toString() : '0',
      rightValue: this.props.rightValue ? this.props.rightValue.toString() : '10',
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setCategory = this.setCategory.bind(this);
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

  private logQuestionGAEvent(action) {
    ReactGA.event({
      category: 'question',
      action,
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
      categoryID: this.state.categoryID,
      leftValue: lv,
      rightValue: rv,
      leftLabel: this.state.leftLabel,
      rightLabel: this.state.rightLabel,
      description: this.state.description,
    })
      .then(() => {
        this.logQuestionGAEvent(`${this.props.edit ? 'edited' : 'created'}`);
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

  private setCategory(_, data) {
    this.setState({
      categoryID: data.value,
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

  private getCategoryOptions() {
    const categories = this.props.data.getOutcomeSet.categories.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
    categories.unshift({
      key: null,
      value: null,
      text: 'No Category',
    });
    return categories;
  }

  public render() {
    const addProps: ButtonProps = {};
    if (this.state.saving) {
      addProps.loading = true;
      addProps.disabled = true;
    }
    return (
      <Message>
        <Message.Content className="likert-form-container">
          <Message.Header>{this.props.edit ? 'Edit Likert Question' : 'New Likert Question'}</Message.Header>
          <div className="likert-form">
            <div className="section upper">
              <Input className="full question-name" autoFocus type="text" placeholder="Question" onChange={this.setNewQuestion} value={this.state.newQuestion} />
              <div className="category">
                <Select placeholder="Category (optional)" options={this.getCategoryOptions()} onChange={this.setCategory} defaultValue={this.state.categoryID} />
              </div>
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

const LikertQuestionForm = getOutcomeSet<IProps>((props) => props.QuestionSetID)(LikertQuestionFormInner);

export { LikertQuestionForm };
