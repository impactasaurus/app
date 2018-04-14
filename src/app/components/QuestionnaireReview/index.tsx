import * as React from 'react';
import {IMeetingMutation, completeMeeting} from 'apollo/modules/meetings';
import {RecordQuestionSummary} from 'components/RecordQuestionSummary';
import 'rc-slider/assets/index.css';
import { Button, ButtonProps, Icon } from 'semantic-ui-react';
import './style.less';
import {IQuestion} from 'models/question';
import {IMeeting} from 'models/meeting';

interface IProps extends IMeetingMutation {
  record: IMeeting;
  recordNotes?: string;
  onComplete: () => void;
  onBack: () => void;
  onQuestionClick: (questionID: string) => void;
}

interface IState {
  completing: boolean;
  completeError: string;
}

class QuestionnaireReviewInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      completing: false,
      completeError: undefined,
    };
    this.review = this.review.bind(this);
    this.renderAnswerReview = this.renderAnswerReview.bind(this);
    this.navigateToQuestion = this.navigateToQuestion.bind(this);
    this.renderNote = this.renderNote.bind(this);
  }

  private review() {
    this.setState({
      completing: true,
      completeError: undefined,
    });
    this.props.completeMeeting(this.props.record.id, this.props.record.beneficiary, this.props.recordNotes)
      .then(() => {
        this.setState({
          completing: false,
          completeError: undefined,
        });
        this.props.onComplete();
      })
      .catch((e: string) => {
        this.setState({
          completing: false,
          completeError: e,
        });
      });
  }

  private navigateToQuestion(selectedQ: IQuestion, _: number): Promise<void> {
    this.props.onQuestionClick(selectedQ.id);
    return Promise.resolve();
  };

  private renderNote(q: IQuestion): JSX.Element {
    const answer = this.props.record.answers.find((a) => a.questionID === q.id);
    if (answer === undefined || answer.notes === undefined || answer.notes === null) {
      return (<span />);
    }
    return (<div className="notes"><Icon name="comments outline" />{answer.notes}</div>);
  };

  private renderAnswerReview(): JSX.Element {
    return (
      <div className="answer-review">
        <RecordQuestionSummary
          recordID={this.props.record.id}
          onQuestionClick={this.navigateToQuestion}
          renderQuestionFooter={this.renderNote}
        />
      </div>
    );
  }

  public render() {
    if (this.props.record === undefined) {
      return (<div />);
    }
    const props: ButtonProps = {};
    if (this.state.completing) {
      props.loading = true;
      props.disabled = true;
    }
    return (
      <div id="questionnaire-review">
        <h1>Review</h1>
        <p>Please review your answers below. Once you are happy, click save, to mark the record as complete.</p>
        {this.renderAnswerReview()}
        <Button onClick={this.props.onBack}>Back</Button>
        <Button {...props} onClick={this.review}>Save</Button>
        <p>{this.state.completeError}</p>
      </div>
    );
  }
}
const QuestionnaireReview = completeMeeting<IProps>(QuestionnaireReviewInner);
export { QuestionnaireReview }
