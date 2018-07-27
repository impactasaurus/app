import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, getMeeting, completeMeeting, IMeetingMutation} from 'apollo/modules/meetings';
import 'rc-slider/assets/index.css';
import {ButtonProps, Grid, Loader, Button} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {IAnswer} from 'models/answer';
import {IQuestion, Question} from 'models/question';
import {QuestionInline} from 'components/QuestionInline';
import {renderArray} from 'helpers/react';
import {getHumanisedDateFromISO} from 'helpers/moment';
import {QuestionnaireReview} from 'components/QuestionnaireReview';
import {MeetingNotepad} from 'components/MeetingNotepad';
const { connect } = require('react-redux');

interface IProps extends IURLConnector, IMeetingMutation {
  data: IMeetingResult;
  match: {
    params: {
      id: string,
    },
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
}

interface IState {
    saving?: boolean;
    completing?: boolean;
    completeError?: string;
    screen?: Screen;
}

enum Screen {
  QUESTION,
  NOTES,
  REVIEW,
}

function answeredAllQuestions(p: IProps): boolean {
  return p.questions.reduce((answeredAll, q) => {
    return answeredAll && p.answers.find((a) => a.questionID === q.id) !== undefined;
  }, true);
}

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data !== undefined && ownProps.data.getMeeting !== undefined) {
    out.questions = (ownProps.data.getMeeting.outcomeSet.questions || [])
      .filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class DataEntryInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      screen: Screen.QUESTION,
    };
    this.completed = this.completed.bind(this);
    this.setSaving = this.setSaving.bind(this);
    this.completed = this.completed.bind(this);
    this.setPage = this.setPage.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.renderFinished = this.renderFinished.bind(this);
    this.renderQuestionPage = this.renderQuestionPage.bind(this);
    this.renderNotepad = this.renderNotepad.bind(this);
  }

  private setPage(page: Screen): () => void {
    return () => {
      this.setState({
        screen: page,
      });
    };
  }

  private completed() {
    this.props.setURL(`/beneficiary/${this.props.data.getMeeting.beneficiary}`, `?q=${this.props.data.getMeeting.outcomeSetID}`);
  }

  private setSaving(toSet: boolean) {
    return () => {
      this.setState({
        saving: toSet,
      });
    };
  }

  private renderQuestion(q: Question, idx: number): JSX.Element {
    return (
      <QuestionInline
        key={q.id}
        index={idx+1}
        record={this.props.data.getMeeting}
        questionID={q.id}
        onSaving={this.setSaving(true)}
        onSaved={this.setSaving(false)}
        disabled={this.state.saving}
      />
    );
  }

  private renderQuestionPage(): JSX.Element {
    const meeting = this.props.data.getMeeting;

    const props: ButtonProps = {};
    if (this.state.completing) {
      props.loading = true;
      props.disabled = true;
    }
    if (this.state.saving) {
      props.disabled = true;
    }
    if (!answeredAllQuestions(this.props)) {
      props.disabled = true;
    }

    return (
      <div>
        <h1>{meeting.beneficiary} - {getHumanisedDateFromISO(meeting.conducted)}</h1>
        {renderArray(this.renderQuestion, this.props.questions)}
        <Button {...props} onClick={this.setPage(Screen.NOTES)}>Next</Button>
        <p>{this.state.completeError}</p>
      </div>
    );
  }

  private renderFinished(): JSX.Element {
    return(
      <QuestionnaireReview
        record={this.props.data.getMeeting}
        onQuestionClick={this.setPage(Screen.QUESTION)}
        onBack={this.setPage(Screen.NOTES)}
        onComplete={this.completed}
      />
    );
  }

  private renderNotepad(): JSX.Element {
    return (
      <MeetingNotepad
        record={this.props.data.getMeeting}
        onComplete={this.setPage(Screen.REVIEW)}
        onBack={this.setPage(Screen.QUESTION)}
      />
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="data-entry">
          <Grid.Column>
            <Helmet>
              <title>Data Entry</title>
            </Helmet>
            <div>
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

    if (this.state.screen === Screen.REVIEW) {
      return wrapper(this.renderFinished());
    }
    if (this.state.screen === Screen.NOTES) {
      return wrapper(this.renderNotepad());
    }
    return wrapper(this.renderQuestionPage());
  }
}
const DataEntry = completeMeeting<IProps>(getMeeting<IProps>((props) => props.match.params.id)(DataEntryInner));
export { DataEntry };
