import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, IMeetingMutation, getMeeting, completeMeeting} from 'apollo/modules/meetings';
import {Question} from 'components/Question';
import {RecordQuestionSummary} from 'components/RecordQuestionSummary';
import 'rc-slider/assets/index.css';
import { Button, Grid, ButtonProps, Loader, Icon } from 'semantic-ui-react';
import './style.less';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IURLConnector} from 'redux/modules/url';
import {IAnswer} from 'models/answer';
import {IQuestion} from 'models/question';
const { connect } = require('react-redux');

interface IProps extends IMeetingMutation, IURLConnector {
  data: IMeetingResult;
  params: {
      id: string,
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
}

interface IState {
    currentQuestion?: string;
    finished?: boolean;
    completing?: boolean;
    completeError?: string;
    init?: boolean;
}

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
      finished: false,
      init: false,
    };
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
    this.setState({
      currentQuestion: question.id,
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
        this.props.setURL(`/beneficiary/${this.props.data.getMeeting.beneficiary}`, `?q=${this.props.data.getMeeting.outcomeSetID}`);
      })
      .catch((e: string) => {
        this.setState({
          completing: false,
          completeError: e,
        });
      });
  }

  private renderAnswerReview(): JSX.Element {
    const navigateToQuestion = (selectedQ: IQuestion, _: number): Promise<void> => {
      const idx = this.props.questions.findIndex((q) => q.id === selectedQ.id);
      this.goToQuestion(idx);
      return Promise.resolve();
    };

    const renderNote = (q: IQuestion): JSX.Element => {
      const answer = this.props.answers.find((a) => a.questionID === q.id);
      if (answer === undefined || answer.notes === undefined || answer.notes === null) {
        return (<span />);
      }
      return (<div className="notes"><Icon name="comments outline" />{answer.notes}</div>);
    };

    return (
      <div className="answer-review">
        <RecordQuestionSummary
          recordID={this.props.params.id}
          onQuestionClick={navigateToQuestion}
          renderQuestionFooter={renderNote}
        />
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
        return wrapper(<Loader active={true} inline="centered" />);
    }
    if (this.state.finished) {
      return wrapper(this.renderFinished());
    }
    const currentQuestionID = this.state.currentQuestion;
    if (currentQuestionID === undefined) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    return wrapper(<Question
      key={currentQuestionID}
      record={meeting}
      questionID={currentQuestionID}
      showPrevious={this.canGoToPreviousQuestion()}
      onPrevious={this.goToPreviousQuestion}
      onNext={this.goToNextQuestionOrReview}
    />);
  }
}
const Meeting = completeMeeting<IProps>(getMeeting<IProps>((props) => props.params.id)(MeetingInner));
export { Meeting }
