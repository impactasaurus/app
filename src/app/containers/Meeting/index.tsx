import * as React from 'react';
import {IMeetingResult, IMeetingMutation, getMeeting, addLikertAnswer} from 'apollo/modules/meetings';
import {Question} from 'models/question';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const style = require('./style.css');

interface IProps extends IMeetingMutation {
  data: IMeetingResult;
  params: {
      id: string,
  };
};

interface IState {
    currentQuestion?: string;
    finished?: boolean;
    saveError?: string;
    currentValue?: number;
};

class MeetingInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: undefined,
      finished: false,
      saveError: undefined,
    };
    this.setAnswer = this.setAnswer.bind(this);
    this.next = this.next.bind(this);
    this.getNextQuestionToAnswer = this.getNextQuestionToAnswer.bind(this);
  }

  public componentDidUpdate() {
    if (this.state.currentQuestion === undefined &&
      this.state.finished === false &&
      this.props.data.getMeeting !== undefined ) {
      const nextQuestion = this.getNextQuestionToAnswer();
      if (nextQuestion === null) {
        this.setState({
          currentQuestion: undefined,
          finished: true,
        });
      } else {
        this.setState({
          currentQuestion: nextQuestion,
          finished: false,
        });
      }
    }
  }

  private getNextQuestionToAnswer(): string|null {
    const questionsToAnswer = this.props.data.getMeeting.outcomeSet.questions.filter((question) => {
      const found = this.props.data.getMeeting.answers.find((answer) => answer.questionID === question.id);
      if (found === undefined) {
        return true;
      }
      return false;
    });
    if (questionsToAnswer.length > 0) {
      return questionsToAnswer[0].id;
    }
    return null;
  }

  private setAnswer(value: number) {
    this.setState({
      currentValue: value,
    });
  }

  private next() {
    this.props.addLikertAnswer(this.props.params.id, this.state.currentQuestion, this.state.currentValue)
    .then(() => {
      this.setState({
        currentQuestion: undefined,
        currentValue: 0,
      });
    })
    .catch((e: string) => {
      this.setState({
        saveError: e,
      });
    });
  }

  public render() {
    const meeting = this.props.data.getMeeting;
    if (meeting === undefined) {
        return (<div />);
    }
    if (this.state.finished) {
      return (
        <div>
          Thanks!
        </div>
      );
    }
    const currentQuestionID = this.state.currentQuestion;
    if (currentQuestionID === undefined) {
      return (<div />);
    }
    const question = meeting.outcomeSet.questions.find((q) => q.id === currentQuestionID);
    if (question === undefined) {
      return (
        <div>
          Unknown question
        </div>
      );
    }
    const q = question as Question;
    return (
      <div>
        <h3>{question.question}</h3>
        <Slider className={style.likertScale} min={q.minValue} max={q.maxValue} defaultValue={q.minValue} onChange={this.setAnswer} />
        <button onClick={this.next}>Next</button>
        <p>{this.state.saveError}</p>
      </div>
    );
  }
}
const Meeting = getMeeting<IProps>((props) => props.params.id)(addLikertAnswer<IProps>(MeetingInner));
export { Meeting }
