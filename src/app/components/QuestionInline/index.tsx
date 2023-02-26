import * as React from "react";
import { addLikertAnswer, IMeetingMutation } from "apollo/modules/meetings";
import { IQuestion, Question as QuestionType } from "models/question";
import { Notepad } from "components/Notepad";
import { IIntAnswer, Answer } from "models/answer";
import { IMeeting } from "models/meeting";
import { Icon, Loader } from "semantic-ui-react";
import { LikertDebounced } from "../LikertDebounced";
import { isNullOrUndefined } from "util";
import { withTranslation, WithTranslation } from "react-i18next";
import ReactGA from "react-ga4";
import "./style.less";

interface IProps extends IMeetingMutation, Partial<WithTranslation> {
  record: IMeeting;
  questionID: string;
  onSaving: () => void;
  onSaved: (error?: Error) => void;
  disabled?: boolean;
  // if provided, will number the question
  index?: number;
}

interface IState {
  value?: number;
  notes?: string;
  saveError?: string;
  saving?: boolean;
}

function hasAnswerChanged(prev: Answer, s: IState): boolean {
  return (
    prev === undefined || s.value !== prev.answer || s.notes !== prev.notes
  );
}

function logGAEvent(action: string) {
  ReactGA.event({
    category: "assessment",
    label: "likert",
    action,
  });
}

class QuestionInlineInner extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      saveError: undefined,
      saving: false,
    };
    this.setAnswer = this.setAnswer.bind(this);
    this.setNotes = this.setNotes.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.getAnswer = this.getAnswer.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
  }

  public componentDidMount() {
    this.loadQuestionIntoState(this.props);
  }

  public componentWillUpdate(nextProps: IProps) {
    const justLoaded =
      this.props.record === undefined && nextProps.record !== undefined;
    const diffQuestion = this.props.questionID !== nextProps.questionID;
    const newAnswer = this.getAnswer(nextProps);
    const currentAnswer = this.getAnswer();
    const answered = currentAnswer === undefined && newAnswer !== undefined;
    const diffAnswer =
      newAnswer !== undefined &&
      currentAnswer !== undefined &&
      (newAnswer.notes !== currentAnswer.notes ||
        newAnswer.answer !== currentAnswer.answer);
    if (justLoaded || diffQuestion || answered || diffAnswer) {
      this.loadQuestionIntoState(nextProps);
    }
  }

  private getQuestion(p?: IProps): IQuestion {
    const props = p || this.props;
    return props.record.outcomeSet.questions.find(
      (q) => q.id === props.questionID
    );
  }

  private getAnswer(p?: IProps): Answer {
    const props = p || this.props;
    return props.record.answers.find(
      (answer) => answer.questionID === props.questionID
    ) as Answer;
  }

  private loadQuestionIntoState(p: IProps) {
    if (p.record === undefined) {
      return;
    }
    const a = this.getAnswer(p);
    if (isNullOrUndefined(a)) {
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

  private setAnswer(value: number) {
    this.save({
      ...this.state,
      value,
    });
  }

  private setNotes(notes: string) {
    this.setState({
      notes,
    });
  }

  private saveNotes() {
    this.save(this.state);
  }

  private save(s: IState) {
    if (this.state.saving || s.value === undefined) {
      return;
    }
    const answer = this.getAnswer();
    if (hasAnswerChanged(answer as IIntAnswer, s) === false) {
      return;
    }
    this.setState({
      saving: true,
    });
    this.props.onSaving();
    this.props
      .addLikertAnswer(
        this.props.record.id,
        this.props.questionID,
        s.value,
        s.notes
      )
      .then(() => {
        this.setState({
          saving: false,
          saveError: undefined,
        });
        logGAEvent("answered");
        this.props.onSaved(undefined);
      })
      .catch((e: Error) => {
        this.setState({
          saving: false,
          saveError: e.message,
        });
        this.props.onSaved(e);
      });
  }

  public render() {
    const { record, t, index, disabled } = this.props;
    if (record === undefined) {
      return <div />;
    }
    const question = this.getQuestion();
    if (question === undefined) {
      return <div>{t("Unknown question")}</div>;
    }
    const q = question as QuestionType;
    let spinner = <span />;
    if (this.state.saving) {
      spinner = <Loader active={true} inline={true} size="mini" />;
    }
    const numbering = index ? `${index}. ` : "";
    return (
      <div className="question-inline">
        <h3>
          {numbering}
          {q.question} {spinner}
        </h3>
        <LikertDebounced
          key={"l-" + q.id}
          leftValue={q.leftValue}
          rightValue={q.rightValue}
          labels={q.labels}
          onChange={this.setAnswer}
          value={this.state.value}
          disabled={disabled}
        />
        {q.noteDeactivated !== true && (
          <Notepad
            key={"np-" + q.id}
            onChange={this.setNotes}
            notes={this.state.notes}
            onBlur={this.saveNotes}
            disabled={disabled}
            collapsible={true}
            required={q.noteRequired}
            prompt={q.notePrompt}
          />
        )}
        {this.state.saveError && (
          <div style={{ marginBottom: "1em" }}>
            <Icon name="exclamation" color="red" />{" "}
            {t("Failed to save your answer")}
          </div>
        )}
      </div>
    );
  }
}
const QuestionInlineTranslated = withTranslation()(QuestionInlineInner);
const QuestionInline = addLikertAnswer<IProps>(QuestionInlineTranslated);
export { QuestionInline };
