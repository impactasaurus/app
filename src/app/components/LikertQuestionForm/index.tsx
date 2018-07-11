import * as React from 'react';
import { Button, ButtonProps, Message, Input, Select } from 'semantic-ui-react';
import {IOutcomeSet} from 'models/outcomeSet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ILabel, ILikertQuestionForm} from 'models/question';
import {LikertForm} from 'components/LikertForm';
import {ILikertForm} from 'models/question';
import './style.less';
import {isNullOrUndefined} from 'util';
const ReactGA = require('react-ga');

interface IProps  {
  QuestionSetID: string;
  data?: IOutcomeResult;
  OnSuccess: ()=>void;
  onCancel: ()=>void;
  onSubmitButtonClick: (question: ILikertQuestionForm)=>Promise<IOutcomeSet>;
  edit?: boolean;
  newQuestion?: string;
  categoryID?: string;
  description?: string;
  short?: string;
  labels?: ILabel[];
  leftValue?: number;
  rightValue?: number;
  submitButtonText: string;
}

interface IState {
  newQuestionError?: string;
  newQuestion?: string;
  categoryID?: string;
  description?: string;
  short?: string;
  labels?: ILabel[];
  leftValue?: number;
  rightValue?: number;
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
      short: this.props.short || '',
      labels: this.props.labels || [],
      leftValue: !isNullOrUndefined(this.props.leftValue) ? this.props.leftValue : 1,
      rightValue: !isNullOrUndefined(this.props.rightValue) ? this.props.rightValue : 5,
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setShort = this.setShort.bind(this);
    this.setLeftValue = this.setLeftValue.bind(this);
    this.setRightValue = this.setRightValue.bind(this);
    this.setLikertOptions = this.setLikertOptions.bind(this);
  }

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
    const lv = this.state.leftValue;
    const rv = this.state.rightValue;
    if (lv === rv) {
      this.setState({
        newQuestionError: 'The left and right values cannot be equal',
      });
      return;
    }
    const findLabelForValue = (val: number): ILabel|undefined => this.state.labels.find((l) => l.value === val);
    if (findLabelForValue(lv) === undefined || findLabelForValue(rv) === undefined) {
      this.setState({
        newQuestionError: 'Questions must have labels on the left and right extremes of the scale',
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
      labels: this.state.labels,
      description: this.state.description,
      short: this.state.short,
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

  private setShort(_, data) {
    this.setState({
      short: data.value,
    });
  }

  private setLikertOptions(options: ILikertForm) {
    this.setState({
      leftValue: options.leftValue,
      rightValue: options.rightValue,
      labels: options.labels,
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
          <div className="likert-question-form">
            <div className="section upper">
              <Input className="full question-name" autoFocus type="text" placeholder="Question" onChange={this.setNewQuestion} value={this.state.newQuestion} />
              <div className="category">
                <Select placeholder="Category (optional)" options={this.getCategoryOptions()} onChange={this.setCategory} defaultValue={this.state.categoryID} />
              </div>
            </div>
            <div className="section upper">
              <Input className="full" type="text" placeholder="Description (optional)" onChange={this.setDescription} value={this.state.description} />
              <div className="short">
                <Input type="text" placeholder="Short Identifier (optional)" onChange={this.setShort} value={this.state.short} />
              </div>
            </div>
            <LikertForm
              edit={this.props.edit}
              labels={this.state.labels}
              leftValue={this.state.leftValue}
              rightValue={this.state.rightValue}
              onChange={this.setLikertOptions}
            />
            <div className="controls">
              <Button onClick={this.props.onCancel}>Cancel</Button>
              <Button {...addProps} primary onClick={this.onSubmitButtonClick}>{this.props.submitButtonText}</Button>
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
