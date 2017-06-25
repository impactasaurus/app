import * as React from 'react';
import {IMeetingResult, getMeeting} from 'redux/modules/meetings';
import {Question} from 'models/question';
import {renderArray} from 'helpers/react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const style = require('./style.css');

interface IProps {
  data: IMeetingResult;
  params: {
      id: string,
  };
};

interface IState {
    answers: {
      [questionID: string]: any;
    };
};

class MeetingInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      answers: {},
    };
    this.renderQuestion = this.renderQuestion.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
    this.save = this.save.bind(this);
  }

  private setAnswer(id: string) {
    return (value: number) => {
      const state = this.state;
      state.answers[id] = value;
      this.setState(state);
    };
  }

  private renderQuestion(q: Question): JSX.Element {
    return (
      <div key={q.id}>
        <p>{q.question}</p>
        <Slider className={style.likertScale} min={q.minValue} max={q.maxValue} defaultValue={q.minValue} onChange={this.setAnswer(q.id)} />
      </div>
    );
  }

  private save() {

  }

  public render() {
    const { data } = this.props;
    const meeting = data.getMeeting;
    if (meeting === undefined) {
        return (<div />);
    }
    const os = meeting.outcomeSet;
    return (
      <div>
        <h2>Questions</h2>
        <div>
          {renderArray(this.renderQuestion, os.questions)}
        </div>
        <button onClick={this.save}>Save and Finish</button>
      </div>
    );
  }
}
const Meeting = getMeeting<IProps>((props) => props.params.id)(MeetingInner);
export { Meeting }
