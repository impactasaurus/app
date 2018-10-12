import * as React from 'react';
import {addLikertAnswer, IMeetingMutation} from 'apollo/modules/meetings';
import {IQuestion, Question as QuestionType} from 'models/question';
import {Likert} from 'components/Likert';
import {Notepad} from 'components/Notepad';
import 'rc-slider/assets/index.css';
import { Button, ButtonProps } from 'semantic-ui-react';
import {IIntAnswer, Answer, IAnswer} from 'models/answer';
import {IMeeting} from 'models/meeting';
const ReactGA = require('react-ga');

interface IProps extends IMeetingMutation {
  record: IMeeting;
  questionID: string;
  // defaults to true
  showPrevious?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

interface IState {
  value?: number;
  notes?: string;
  saveError?: string;
  saving?: boolean;
}

function hasAnswerChanged(prev: Answer, s: IState): boolean {
  return prev === undefined || s.value !== prev.answer || s.notes !== prev.notes;
}

function logGAEvent(action: string) {
  ReactGA.event({
    category : 'assessment',
    label : 'likert',
    action,
  });
}

class QuestionInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      saveError: undefined,
      saving: false,
    };
    this.setAnswer = this.setAnswer.bind(this);
    this.setNotes = this.setNotes.bind(this);
    this.next = this.next.bind(this);
    this.goToPreviousQuestion = this.goToPreviousQuestion.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.getAnswer = this.getAnswer.bind(this);
  }

  public componentDidMount() {
    this.loadQuestionIntoState(this.props);
  }

  public componentWillUpdate(nextProps: IProps) {
    if (this.props.questionID !== nextProps.questionID || this.props.record === undefined && nextProps.record !== undefined) {
      this.loadQuestionIntoState(nextProps);
    }
  }

  private getQuestion(p?: IProps): IQuestion {
    const props = p || this.props;
    return props.record.outcomeSet.questions.find((q) => q.id === props.questionID);
  }

  private getAnswer(p?: IProps): IAnswer {
    const props = p || this.props;
    return props.record.answers.find((answer) => answer.questionID === props.questionID);
  }

  private loadQuestionIntoState(p: IProps) {
    if (p.record === undefined) {
      return;
    }
    const a = this.getAnswer(p) as IIntAnswer;
    if (a === undefined || a === null) {
      this.setState({
        notes: undefined,
        value: undefined,
      });
    } else {
      this.setState({
        notes: a.notes,
        value: a.answer,
      });
    }
  }

  private goToPreviousQuestion() {
    this.props.onPrevious();
  }

  private setAnswer(value: number) {
    this.setState({
      value,
    });
  }

  private setNotes(notes: string) {
    this.setState({
      notes,
    });
  }

  private next() {
    const answer = this.getAnswer();
    if (hasAnswerChanged(answer as IIntAnswer, this.state) === false) {
      this.props.onNext();
      return;
    }
    this.setState({
      saving: true,
    });
    this.props.addLikertAnswer(this.props.record.id, this.props.questionID, this.state.value, this.state.notes)
      .then(() => {
        this.setState({
          saving: false,
          saveError: undefined,
        });
        logGAEvent('answered');
        this.props.onNext();
      })
      .catch(() => {
        this.setState({
          saving: false,
          saveError: 'Failed to save your answer',
        });
      });
  }

  public render(): JSX.Element {
    const record = this.props.record;
    if (record === undefined) {
      return (<div />);
    }
    const question = this.getQuestion();
    if (question === undefined) {
      return (<div>Unknown question</div>);
    }
    const q = question as QuestionType;
    const nextProps: ButtonProps = {};
    if (this.state.saving) {
      nextProps.loading = true;
      nextProps.disabled = true;
    }
    if (this.state.value === undefined) {
      nextProps.disabled = true;
    }
    return (
      <div>
        <h1>{q.question}</h1>
        <h3>{q.description}</h3>
        <Likert key={'l-' + q.id} leftValue={q.leftValue} rightValue={q.rightValue} labels={q.labels} onChange={this.setAnswer} value={this.state.value} />
        <Notepad key={'np-' + q.id} onChange={this.setNotes} notes={this.state.notes} />
        {(this.props.showPrevious !== false) && <Button onClick={this.goToPreviousQuestion}>Back</Button>}
        <Button {...nextProps} onClick={this.next}>Next</Button>
        <p>{this.state.saveError}</p>
      </div>
    );
  }
}
const Question = addLikertAnswer<IProps>(QuestionInner);
export { Question };
