import * as React from 'react';
import {getMeetings, IMeetingResult} from 'apollo/modules/meetings';
import {IMeeting} from 'models/meeting';
import {getOutcomeGraph} from '@ald-life/outcome-graph';
import {Answer} from 'models/answer';
import {IURLConnector} from 'redux/modules/url';
import {renderArray} from 'helpers/react';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
const { connect } = require('react-redux');

let count = 0;

interface IProp extends IURLConnector {
  beneficiaryID: string;
  data?: IMeetingResult;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class MeetingViewInner extends React.Component<IProp, any> {

  private canvasID: string;

  constructor(props) {
    super(props);
    this.canvasID = `meeting-view-${count++}`;
    this.navigateToMeeting = this.navigateToMeeting.bind(this);
    this.printMeetingControls = this.printMeetingControls.bind(this);
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
          question = q.question;
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
    getOutcomeGraph(this.canvasID, 'title', meeting);
  }

  private navigateToMeeting(meeting: IMeeting): ()=>void {
    return () => {
      this.props.setURL(`/meeting/${meeting.id}`);
    };
  }

  private canBeContinued(meeting: IMeeting) {
    return meeting.answers.length < meeting.outcomeSet.questions.length;
  }

  private printMeetingControls(meeting: IMeeting) {
    const buttons: JSX.Element[] = [];
    if (this.canBeContinued(meeting)) {
      buttons.push((<button key="cont" onClick={this.navigateToMeeting(meeting)}>Continue</button>));
    }
    return (
      <div key={meeting.id}>
        {new Date(meeting.conducted).toLocaleString()}
        {buttons}
      </div>
    );
  }

  public render() {
    return (
      <div>
        <h3>Meetings:</h3>
        {renderArray<IMeeting>(this.printMeetingControls, this.props.data.getMeetings)}
        <hr />
        <h3>Review:</h3>
        <div id="wrapper" style={{position: 'relative',height: '60vh', width:'60vw', margin:'auto'}}>
          <canvas id={this.canvasID} width={500} height={500} />
        </div>
      </div>
    );
  }
}

const MeetingView = getMeetings<IProp>((p) => p.beneficiaryID)(MeetingViewInner);
export { MeetingView }
