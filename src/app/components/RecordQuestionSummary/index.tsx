import React from 'react';
import {Loader, Icon} from 'semantic-ui-react';
import {IQuestion, Question} from 'models/question';
import {getMeeting, IMeetingResult} from 'apollo/modules/meetings';
import {Answer, IAnswer} from 'models/answer';
import {getQuestions} from 'helpers/questionnaire';
import {renderArray} from 'helpers/react';
import {Likert} from 'components/Likert';
import {IMeeting} from 'models/meeting';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';
import './style.less';

interface IProps {
  recordID: string;
  onQuestionClick?: (question: IQuestion, value: number) => Promise<void>;

  // apollo gathered
  data?: IMeetingResult;
  questions?: IQuestion[];
  answers?: IAnswer[];
}

const renderQuestionNote = (q: IQuestion, r: IMeeting): JSX.Element => {
  const answer = r.answers.find((a) => a.questionID === q.id);
  if (answer === undefined || answer.notes === undefined || answer.notes === null) {
    return (<div className="notes"/>);
  }
  return (<div className="notes"><Icon name="comments outline" />{answer.notes}</div>);
}

const renderQuestionnaireNote = (r: IMeeting): JSX.Element => {
  if (!r.notes) {
    return (<span />);
  }
  return (<div className="notes main"><Icon name="comments outline" />{r.notes}</div>);
}

const wrapper = (inner: JSX.Element): JSX.Element => {
  return (
    <div className="record-question-summary">
      {inner}
    </div>
  );
};

const RecordQuestionSummaryInner = (p: IProps) => {

  const {t} = useTranslation();

  const likertOnClick = (q: Question) => {
    return (v: number): void => {
      p.onQuestionClick(q, v);
    };
  }

  const renderQuestion = (q: Question): JSX.Element => {
    const answer = p.answers.find((a) => a.questionID === q.id);
    let inner = (<div>{t("Unknown Answer")}</div>);
    if (answer !== undefined) {
      const likert = (
        <Likert
          leftValue={q.leftValue}
          rightValue={q.rightValue}
          labels={q.labels}
          value={(answer as Answer).answer}
          onChange={likertOnClick(q)}
        />
      );
      inner = (
        <div>
          {likert}
        </div>
      );
    }

    return (
      <div key={q.id} className="question">
        <h3>{q.question}</h3>
        {inner}
        {renderQuestionNote(q, p.data.getMeeting)}
      </div>
    );
  }

  if (p.data.getMeeting === undefined) {
    return wrapper(<Loader active={true} inline="centered"/>);
  }
  return wrapper((
    <div>
      {renderQuestionnaireNote(p.data.getMeeting)}
      {renderArray<Question>(renderQuestion, p.questions as Question[])}
    </div>
  ));
}

const propsPreprocessing = (_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data.getMeeting !== undefined) {
    out.questions = getQuestions(ownProps.data.getMeeting.outcomeSet);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
};

const RecordQuestionSummaryConnected = connect(propsPreprocessing)(RecordQuestionSummaryInner);
const RecordQuestionSummary = getMeeting<IProps>((props) => props.recordID)(RecordQuestionSummaryConnected);
export {RecordQuestionSummary};
