import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, getMeeting} from 'apollo/modules/meetings';
import {Question} from 'components/Question';
import 'rc-slider/assets/index.css';
import { Grid, Loader, Progress } from 'semantic-ui-react';
import './style.less';
import { bindActionCreators } from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {Error} from 'components/Error';
import {IAnswer} from 'models/answer';
import {IQuestion} from 'models/question';
import {QuestionnaireReview} from 'components/QuestionnaireReview';
import {QuestionnaireInstructions} from 'components/QuestionnaireInstructions';
import {MeetingNotepad} from 'components/MeetingNotepad';
import {isNullOrUndefined} from 'util';
import {IOutcomeSet} from 'models/outcomeSet';
import {Screen, IMeetingState, getPreviousState, canGoBack, getNextState, initialState} from './state-machine';
import {journey} from 'helpers/url';
import {isBeneficiaryUser} from '../../helpers/auth';
import {Thanks} from './thanks';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  data: IMeetingResult;
  match: {
    params: {
      id: string,
    },
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
  questionnaire?: IOutcomeSet;
}

interface IState {
    currentQuestion?: string;
    screen?: Screen;
    init?: boolean;
}

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data !== undefined && ownProps.data.getMeeting !== undefined) {
    out.questions = (ownProps.data.getMeeting.outcomeSet.questions || [])
      .filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
    out.questionnaire = ownProps.data.getMeeting.outcomeSet;
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
      init: false,
      screen: Screen.QUESTION,
    };
    this.renderFinished = this.renderFinished.bind(this);
    this.goToNextScreen = this.goToNextScreen.bind(this);
    this.canGoToPrevious = this.canGoToPrevious.bind(this);
    this.goToPreviousScreen = this.goToPreviousScreen.bind(this);
    this.completed = this.completed.bind(this);
    this.goToQuestionWithID = this.goToQuestionWithID.bind(this);
    this.renderNotepad = this.renderNotepad.bind(this);
    this.renderProgressBar = this.renderProgressBar.bind(this);
    this.renderInstructions = this.renderInstructions.bind(this);
    this.hasInstructions = this.hasInstructions.bind(this);
    this.currentQuestionIdx = this.currentQuestionIdx.bind(this);
  }

  public componentDidUpdate() {
    if (this.props.questions !== undefined && this.state.init === false) {
      this.setState({init: true});
      this.setMeetingState(initialState(this.hasInstructions()));
    }
  }

  private goToQuestionWithID(qID: string) {
    const idx = this.props.questions.findIndex((q) => q.id === qID);
    this.setMeetingState({
      screen: Screen.QUESTION,
      qIdx: idx,
    });
  }

  private completed() {
    if(isBeneficiaryUser()) {
      this.setMeetingState({
        screen: Screen.THANKS,
        qIdx: this.currentQuestionIdx(),
      });
    } else {
      journey(this.props.setURL, this.props.data.getMeeting.beneficiary, this.props.data.getMeeting.outcomeSetID);
    }
  }

  private hasInstructions() {
    return !isNullOrUndefined(this.props.questionnaire.instructions) &&
      this.props.questionnaire.instructions.length !== 0;
  }

  private currentQuestionIdx(): number {
    return this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
  }

  private goToNextScreen() {
    const nextState = getNextState(this.state.screen, this.currentQuestionIdx(), this.props.questions.length);
    this.setMeetingState(nextState);
  }

  private setMeetingState(s: IMeetingState) {
    let idxx = s.qIdx;
    if (idxx < 0) {
      idxx = 0;
    }
    if (idxx >= this.props.questions.length) {
      idxx = this.props.questions.length - 1;
    }
    const question = this.props.questions[idxx];
    this.setState({
      currentQuestion: question.id,
      screen: s.screen,
    });
  }

  private goToPreviousScreen() {
    const prevState = getPreviousState(this.state.screen, this.currentQuestionIdx(), this.hasInstructions());
    this.setMeetingState(prevState);
  }

  private canGoToPrevious(): boolean {
    return canGoBack(this.state.screen, this.currentQuestionIdx(), this.hasInstructions());
  }

  private renderFinished(): JSX.Element {
    return(
      <QuestionnaireReview
        record={this.props.data.getMeeting}
        onQuestionClick={this.goToQuestionWithID}
        onBack={this.goToPreviousScreen}
        onComplete={this.completed}
      />
    );
  }

  private renderNotepad(): JSX.Element {
    return (
      <MeetingNotepad
        record={this.props.data.getMeeting}
        onComplete={this.goToNextScreen}
        onBack={this.goToPreviousScreen}
      />
    );
  }

  private renderInstructions(): JSX.Element {
    return (
      <QuestionnaireInstructions
        title={this.props.questionnaire.name}
        text={this.props.questionnaire.instructions}
        onNext={this.goToNextScreen}
      />
    );
  }

  private renderProgressBar(): JSX.Element {
    let value = this.currentQuestionIdx();
    if (this.state.screen === Screen.NOTES || this.state.screen === Screen.REVIEW) {
      value = this.props.questions.length;
    }
    return (<Progress value={value} total={this.props.questions.length} size="tiny" />);
  }

  public render() {
    const wrapper = (inner: JSX.Element, progress: JSX.Element = <div />): JSX.Element => {
      return (
        <div id="meeting">
          {progress}
          <Grid container={true} columns={1}>
            <Grid.Column>
              <Helmet>
                <title>Questionnaire</title>
              </Helmet>
              <div>
                {inner}
              </div>
            </Grid.Column>
          </Grid>
        </div>
      );
    };

    if (this.props.data.error) {
      return wrapper((<Error text="Failed to load" />));
    }
    if (this.props.data.loading || this.props.data.getMeeting === undefined) {
        return wrapper(<Loader active={true} inline="centered" />);
    }
    if (this.state.screen === Screen.REVIEW) {
      return wrapper(this.renderFinished(), this.renderProgressBar());
    }
    if (this.state.screen === Screen.NOTES) {
      return wrapper(this.renderNotepad(), this.renderProgressBar());
    }
    if (this.state.screen === Screen.INSTRUCTIONS) {
      return wrapper(this.renderInstructions(), this.renderProgressBar());
    }
    if (this.state.screen === Screen.THANKS) {
      return wrapper(<Thanks />);
    }
    const currentQuestionID = this.state.currentQuestion;
    if (currentQuestionID === undefined) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    const meeting = this.props.data.getMeeting;
    return wrapper((
        <Question
        key={currentQuestionID}
        record={meeting}
        questionID={currentQuestionID}
        showPrevious={this.canGoToPrevious()}
        onPrevious={this.goToPreviousScreen}
        onNext={this.goToNextScreen}
      />
    ), this.renderProgressBar());
  }
}
const Meeting = getMeeting<IProps>((props) => props.match.params.id)(MeetingInner);
export { Meeting };
