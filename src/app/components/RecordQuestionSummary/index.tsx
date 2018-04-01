import * as React from 'react';
import {Loader} from 'semantic-ui-react';
import {IQuestion} from 'models/question';
import {getMeeting} from 'apollo/modules/meetings';
import {IMeetingResult} from 'apollo/modules/meetings';
import {Answer, IAnswer} from 'models/answer';
import {Question} from 'models/question';
import {getQuestions} from 'helpers/questionnaire';
import {renderArray} from 'helpers/react';
import {Likert} from 'components/Likert';
const { connect } = require('react-redux');

interface IProps {
  recordID: string;
  onQuestionClick?: (question: IQuestion, value: number) => Promise<void>;
  renderQuestionFooter?: (question: IQuestion) => JSX.Element;

  // apollo gathered
  data?: IMeetingResult;
  questions?: IQuestion[];
  answers?: IAnswer[];
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
          leftValue={q.minValue}
          rightValue={q.maxValue}
          leftLabel={q.minLabel}
          rightLabel={q.maxLabel}
          value={(answer as Answer).answer}
          onChange={this.likertOnClick(q)}
        />
      );
      if (this.props.renderQuestionFooter === undefined) {
        inner = likert;
      } else {
        inner = (
          <div>
            {likert}
            {this.props.renderQuestionFooter(q)}
          </div>
        );
      }
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
        {renderArray<Question>(this.renderQuestion, this.props.questions as Question[])}
      </div>
    ));
  }
}

const RecordQuestionSummary = getMeeting<IProps>((props) => props.recordID)(RecordQuestionSummaryInner);
export {RecordQuestionSummary};
