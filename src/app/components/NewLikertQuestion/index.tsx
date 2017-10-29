import * as React from 'react';
import { Button, ButtonProps, Message, Select, Input } from 'semantic-ui-react';
import {IQuestionMutation, addLikertQuestion} from 'apollo/modules/questions';
import {IOutcomeResult, getOutcomeSet} from 'apollo/modules/outcomeSets';
import {ICategoryMutation, setCategory} from 'apollo/modules/categories';
import { Likert} from 'components/Likert';
import './style.less';
const ReactGA = require('react-ga');

interface IProps extends IQuestionMutation, ICategoryMutation {
  QuestionSetID: string;
  OnSuccess: ()=>void;
  data?: IOutcomeResult;
}

interface IState {
  newQuestionError?: string;
  newQuestion?: string;
  description?: string;
  category?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
  saving?: boolean;
}

class NewLikertQuestionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      leftValue: '0',
      rightValue: '10',
    };
    this.addQuestion = this.addQuestion.bind(this);
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

  private logQuestionCreatedGAEvent() {
    ReactGA.event({
        category: 'question',
        action: 'created',
        label: 'likert',
    });
  }

  private addQuestion() {
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
    this.props.addLikertQuestion(this.props.QuestionSetID, this.state.newQuestion, lv, rv, this.state.leftLabel, this.state.rightLabel, this.state.description)
    .then((QuestionSet) => {
      this.logQuestionCreatedGAEvent();
      if (this.state.category) {
        const QuestionID = QuestionSet.questions.pop().id;
        this.props.setCategory(this.props.QuestionSetID, QuestionID, this.state.category);
      }
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
      category: data.value,
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
        <Message.Content>
          <Message.Header>New Likert Question</Message.Header>
          <div className="new-likert-form">
            <div className="section upper">
              <Input className="full question-name" autoFocus type="text" placeholder="Question Name" onChange={this.setNewQuestion} />
              <div className="category">
                <Select placeholder="Category (optional)" options={this.getCategoryOptions()} onChange={this.setCategory} />
              </div>
            </div>
            <div className="section upper">
              <Input className="full" type="text" placeholder="Description (optional)" onChange={this.setDescription} />
            </div>
            <div className="section mid">
              <Input className="left" type="text" placeholder="Left Label (optional)" onChange={this.setLeftLabel} />
              <Input className="right" type="text" placeholder="Right Label (optional)" onChange={this.setRightLabel} />
            </div>
            <div className="section likert">
              <Likert
                leftValue={this.leftValueInt(this.state)}
                rightValue={this.rightValueInt(this.state)}
                onChange={this.noop}
                disabled={true} />
            </div>
            <div className="section lower">
              <Input className="left" type="number" placeholder="Left Value" onChange={this.setLeftValue} defaultValue={this.state.leftValue} />
              <Input className="right" type="number" placeholder="Right Value" onChange={this.setRightValue} defaultValue={this.state.rightValue} />
            </div>
            <div className="controls">
              <Button {...addProps} onClick={this.addQuestion}>Add</Button>
              <p>{this.state.newQuestionError}</p>
            </div>
          </div>
        </Message.Content>
      </Message>
    );
  }
}

const NewLikertQuestion = getOutcomeSet<IProps>((props) => props.QuestionSetID)(setCategory<IProps>(addLikertQuestion<IProps>(NewLikertQuestionInner)));
export { NewLikertQuestion };
