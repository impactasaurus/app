import * as React from 'react';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {getOutcomeGraph} from '@ald-life/outcome-graph';
import {Loader} from 'semantic-ui-react';
import {Answer} from 'models/answer';
import './style.less';

let count = 0;

interface IProp {
  beneficiaryID: string;
  data?: IMeetingResult;
}

class MeetingViewInner extends React.Component<IProp, any> {

  private canvasID: string;

  constructor(props) {
    super(props);
    this.canvasID = `meeting-view-${count++}`;
  }

  public componentDidUpdate() {
    if (this.props.data.getMeetings === undefined) {
      return;
    }
    const meeting = this.props.data.getMeetings.map((meeting) => {
      const answers = meeting.answers.map((answer: Answer) => {
        const q = meeting.outcomeSet.questions.find((q) => q.id === answer.questionID);
        let question = 'Unknown Question';
        if (q !== undefined) {
          if (q.archived) {
            question = `${q.question} (archived)`;
          } else {
            question = q.question;
          }
        }
        return {
          outcome: question,
          value: answer.answer,
        };
      });
      return {
        timestamp: meeting.conducted,
        outcomes: answers,
      };
    });
    getOutcomeGraph(this.canvasID, '', meeting);
  }

  public render() {
    if (this.props.data.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    if (!Array.isArray(this.props.data.getMeetings) ||
      this.props.data.getMeetings.length === 0) {
      return (
        <p>No meetings found for beneficiary {this.props.beneficiaryID}</p>
      );
    }
    return (
      <div className="meeting-view">
        <h2>{this.props.beneficiaryID}</h2>
        <div id="wrapper" style={{position: 'relative', margin:'auto'}}>
          <canvas id={this.canvasID} />
        </div>
      </div>
    );
  }
}

const MeetingView = getMeetings<IProp>((p) => p.beneficiaryID)(MeetingViewInner);
export { MeetingView }
