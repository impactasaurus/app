import * as React from 'react';
import {Loader, Icon} from 'semantic-ui-react';
import {IQuestion} from 'models/question';
import {getMeeting} from 'apollo/modules/meetings';
import {IMeetingResult} from 'apollo/modules/meetings';
import {Answer, IAnswer} from 'models/answer';
import {Question} from 'models/question';
import {getQuestions} from 'helpers/questionnaire';
import {renderArray} from 'helpers/react';
import {Likert} from 'components/Likert';
import {IMeeting} from '../../models/meeting';
import {isNullOrUndefined} from 'util';
const { connect } = require('react-redux');

interface IProps {
  recordID: string;
  onQuestionClick?: (question: IQuestion, value: number) => Promise<void>;

  // apollo gathered
  data?: IMeetingResult;
  questions?: IQuestion[];
  answers?: IAnswer[];
}

function renderQuestionNote(q: IQuestion, r: IMeeting): JSX.Element {
  const answer = r.answers.find((a) => a.questionID === q.id);
  if (answer === undefined || answer.notes === undefined || answer.notes === null) {
    return (<span />);
  }
  return (<div className="notes"><Icon name="comments outline" />{answer.notes}</div>);
}

function renderQuestionnaireNote(r: IMeeting): JSX.Element {
  if (isNullOrUndefined(r.notes)) {
    return (<span />);
  }
  return (<div className="notes"><Icon name="comments outline" />{r.notes}</div>);
}

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data.getMeeting !== undefined) {
    out.questions = getQuestions(ownProps.data.getMeeting.outcomeSet);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
})
class RecordQuestionSummaryInner extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.likertOnClick = this.likertOnClick.bind(this);
  }

  private likertOnClick(q: Question) {
    return (v: number): void => {
      this.props.onQuestionClick(q, v);
    };
  }

  private renderQuestion(q: Question): JSX.Element {
    const answer = this.props.answers.find((a) => a.questionID === q.id);
    let inner = (<div>Unknown Answer</div>);
    if (answer !== undefined) {
      const likert = (
        <Likert
          leftValue={q.leftValue}
          rightValue={q.rightValue}
          labels={q.labels}
          value={(answer as Answer).answer}
          onChange={this.likertOnClick(q)}
        />
      );
      inner = (
        <div>
          {likert}
          {renderQuestionNote(q, this.props.data.getMeeting)}
        </div>
      );
    }

    return (
      <div key={q.id}>
        <h3>{q.question}</h3>
        {inner}
      </div>
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <div className="record-question-summary">
          {inner}
        </div>
      );
    };
    if (this.props.data.getMeeting === undefined) {
      return wrapper(<Loader active={true} inline="centered"/>);
    }
    return wrapper((
      <div>
        {renderQuestionnaireNote(this.props.data.getMeeting)}
        {renderArray<Question>(this.renderQuestion, this.props.questions as Question[])}
      </div>
    ));
  }
}

const RecordQuestionSummary = getMeeting<IProps>((props) => props.recordID)(RecordQuestionSummaryInner);
export {RecordQuestionSummary};
