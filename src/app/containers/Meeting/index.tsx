import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, IMeetingMutation, getMeeting, addLikertAnswer, completeMeeting} from 'apollo/modules/meetings';
import {Question} from 'models/question';
import { Likert} from 'components/Likert';
import 'rc-slider/assets/index.css';
import { Button, Grid, ButtonProps } from 'semantic-ui-react';
import './style.less';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IURLConnector} from 'redux/modules/url';
import {IIntAnswer, IAnswer, Answer} from 'models/answer';
import {IQuestion} from 'models/question';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

interface IProps extends IMeetingMutation, IURLConnector {
  data: IMeetingResult;
  params: {
      id: string,
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
};

interface IState {
    currentQuestion?: string;
    finished?: boolean;
    currentValue?: number;
    saveError?: string;
    saving?: boolean;
    completing?: boolean;
    completeError?: string;
    init?: boolean;
};

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data.getMeeting !== undefined) {
    out.questions = (ownProps.data.getMeeting.outcomeSet.questions || [])
      .filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class MeetingInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: undefined,
      currentValue: undefined,
      finished: false,
      saveError: undefined,
      saving: false,
      init: false,
    };
    this.setAnswer = this.setAnswer.bind(this);
    this.next = this.next.bind(this);
    this.renderFinished = this.renderFinished.bind(this);
    this.review = this.review.bind(this);
    this.goToQuestion = this.goToQuestion.bind(this);
    this.goToReview = this.goToReview.bind(this);
    this.goToNextQuestionOrReview = this.goToNextQuestionOrReview.bind(this);
    this.canGoToPreviousQuestion = this.canGoToPreviousQuestion.bind(this);
    this.goToPreviousQuestion = this.goToPreviousQuestion.bind(this);
    this.renderAnswerReview = this.renderAnswerReview.bind(this);
  }

  public componentDidUpdate() {
    if (this.props.questions !== undefined && this.state.init === false) {
      this.setState({init: true});
      if (this.props.questions.length <= 0) {
        this.goToReview();
      } else {
        this.goToQuestion(0);
      }
    }
  }

  private goToQuestion(idx: number) {
    let idxx = idx;
    if (idx < 0) {
      idxx = 0;
    }
    if (idx >= this.props.questions.length) {
      idxx = this.props.questions.length - 1;
    }
    const question = this.props.questions[idxx];
    const answer = this.props.answers.find((answer) => answer.questionID === question.id);
    this.setState({
      currentQuestion: question.id,
      currentValue: (answer ? (answer as IIntAnswer).answer : undefined),
      finished: false,
    });
  }

  private goToReview() {
    this.setState({
      finished: true,
    });
  }

  private goToNextQuestionOrReview() {
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    if (this.props.questions.length > currentIdx + 1) {
      this.goToQuestion(currentIdx+1);
    } else {
      this.goToReview();
    }
  }

  private goToPreviousQuestion() {
    if (this.state.finished) {
      return this.setState({
        finished: false,
      });
    }
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    if (currentIdx === -1 || currentIdx === 0) {
      return;
    }
    this.goToQuestion(currentIdx-1);
  }

  private canGoToPreviousQuestion(): boolean {
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    return currentIdx !== -1 && currentIdx !== 0;
  }

  private setAnswer(value: number) {
    this.setState({
      currentValue: value,
    });
  }

  private logGAEvent(action: string) {
    ReactGA.event({
      category : 'assessment',
      label : 'likert',
      action,
    });
  }

  private next() {
    const answer = this.props.answers.find((answer) => answer.questionID === this.state.currentQuestion);
    if (answer !== undefined && this.state.currentValue === (answer as Answer).answer) {
      this.goToNextQuestionOrReview();
      return;
    }
    this.setState({
      saving: true,
    });
    this.props.addLikertAnswer(this.props.params.id, this.state.currentQuestion, this.state.currentValue)
    .then(() => {
      this.setState({
        saving: false,
        saveError: undefined,
      });
      this.logGAEvent('answered');
      this.goToNextQuestionOrReview();
    })
    .catch((e: string) => {
      this.setState({
        saving: false,
        saveError: e,
      });
    });
  }

  private review() {
    this.setState({
      completing: true,
    });
    this.props.completeMeeting(this.props.params.id, this.props.data.getMeeting.beneficiary)
      .then(() => {
        this.setState({
          completing: false,
          completeError: undefined,
        });
        this.props.setURL(`/beneficiary/${this.props.data.getMeeting.beneficiary}`);
      })
      .catch((e: string) => {
        this.setState({
          completing: false,
          completeError: e,
        });
      });
  }

  private renderAnswerReview(): JSX.Element {
    const navigateToQuestion = (idx: number) => {
      return () => this.goToQuestion(idx);
    };
    const children: JSX.Element[] = this.props.questions.map((q: Question, idx: number) => {
      const answer = this.props.answers.find((a) => a.questionID === q.id);
      const inner = answer === undefined ?
        (<div>Unknown Answer</div>) :
        (<Likert leftValue={q.minValue} rightValue={q.maxValue} leftLabel={q.minLabel} rightLabel={q.maxLabel} onChange={navigateToQuestion(idx)} value={(answer as Answer).answer} />);
      return (
        <div key={q.id}>
          <h3>{q.question}</h3>
          {inner}
        </div>
      );
    });
    return(
      <div className="answer-review">
        {children}
      </div>
    );
  }

  private renderFinished(): JSX.Element {
    const props: ButtonProps = {};
    if (this.state.completing) {
      props.loading = true;
      props.disabled = true;
    }
    return (
      <div>
        <h1>Review</h1>
        <p>Please review your answers below. Once you are happy, click save, to mark the record as complete.</p>
        {this.renderAnswerReview()}
        <Button onClick={this.goToPreviousQuestion}>Back</Button>
        <Button {...props} onClick={this.review}>Save</Button>
        <p>{this.state.completeError}</p>
      </div>
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container columns={1} id="meeting">
          <Grid.Column>
            <Helmet>
              <title>Questionnaire</title>
            </Helmet>
            <div id="meeting">
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };

    const meeting = this.props.data.getMeeting;
    if (meeting === undefined) {
        return wrapper(<div />);
    }
    if (this.state.finished) {
      return wrapper(this.renderFinished());
    }
    const currentQuestionID = this.state.currentQuestion;
    if (currentQuestionID === undefined) {
      return wrapper(<div />);
    }
    const question = meeting.outcomeSet.questions.find((q) => q.id === currentQuestionID);
    if (question === undefined) {
      return wrapper(<div>Unknown question</div>);
    }
    const q = question as Question;
    const nextProps: ButtonProps = {};
    if (this.state.saving) {
      nextProps.loading = true;
      nextProps.disabled = true;
    }
    if (this.state.currentValue === undefined) {
      nextProps.disabled = true;
    }
    return wrapper((
      <div>
        <h1>{question.question}</h1>
        <h3>{question.description}</h3>
        <Likert key={this.state.currentQuestion} leftValue={q.minValue} rightValue={q.maxValue} leftLabel={q.minLabel} rightLabel={q.maxLabel} onChange={this.setAnswer} value={this.state.currentValue} />
        {this.canGoToPreviousQuestion() && <Button onClick={this.goToPreviousQuestion}>Back</Button>}
        <Button {...nextProps} onClick={this.next}>Next</Button>
        <p>{this.state.saveError}</p>
      </div>
    ));
  }
}
const Meeting = completeMeeting<IProps>(getMeeting<IProps>((props) => props.params.id)(addLikertAnswer<IProps>(MeetingInner)));
export { Meeting }
