import * as React from 'react';
import { Button, ButtonProps, Message, Form, Input } from 'semantic-ui-react';
import {IOutcomeSet} from 'models/outcomeSet';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ILabel, ILikertQuestionForm} from 'models/question';
import {LikertForm} from 'components/LikertForm';
import {Hint} from 'components/Hint';
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
          <Form>
            <Form.Group>
              <Form.Input required label="Question" placeholder="Question" width={12} onChange={this.setNewQuestion} value={this.state.newQuestion} />
              <Form.Field width={4}>
                <label>Shortened Form <Hint text="Shortened form of the question. Used instead of the question, when reviewing data in visualisations and exports"/></label>
                <Input placeholder="Shortened Form" onChange={this.setShort} value={this.state.short} />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Input label="Description" placeholder="Description" width={12} onChange={this.setDescription} value={this.state.description} />
              <Form.Select label="Category" placeholder="Category" options={this.getCategoryOptions()} width={4} onChange={this.setCategory} defaultValue={this.state.categoryID} />
            </Form.Group>
          </Form>

          <div className="likert-question-form">
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
