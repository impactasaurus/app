import * as React from 'react';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IMeetingMutation, newMeeting} from 'apollo/modules/meetings';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Button, Select, Input } from 'semantic-ui-react';
const { connect } = require('react-redux');
const style = require('./style.css');

interface IProp extends IOutcomeMutation, IMeetingMutation, IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  startMeetingError: string;
  selectedOS?: string;
  selectedBenID?: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ConductInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      startMeetingError: undefined,
    };
    this.renderNewMeetingControl = this.renderNewMeetingControl.bind(this);
    this.startMeeting = this.startMeeting.bind(this);
    this.setOS = this.setOS.bind(this);
    this.setBenID = this.setBenID.bind(this);
  }

  private startMeeting() {
    const benID = this.state.selectedBenID;
    const osID = this.state.selectedOS;
    this.props.newMeeting(benID, osID, new Date())
    .then((meeting) => {
      this.props.setURL(`/meeting/${meeting.id}`);
    })
    .catch((e: Error)=> {
      this.setState({
        startMeetingError: e.message,
      });
    });
  }

  private getOptions(oss: IOutcomeSet[]): any[] {
    if (oss === undefined) {
      return [];
    }
    return oss.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
  }

  private setOS(_, data) {
    this.setState({
      selectedOS: data.value,
    });
  }

  private setBenID(_, data) {
    this.setState({
      selectedBenID: data.value,
    });
  }

  private renderNewMeetingControl(outcomeSets: IOutcomeSet[]|undefined): JSX.Element {
    return (
      <div>
        <Input type="text" placeholder="Beneficiary ID" onChange={this.setBenID} />
        <Select placeholder="Outcome Set" onChange={this.setOS} options={this.getOptions(outcomeSets)} />
        <Button onClick={this.startMeeting}>Start</Button>
        <p>{this.state.startMeetingError}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    return (
      <div className={style.Home}>
        <p>
          Conduct meetings with beneficiaries here <br />
          Initially capture: Beneficiary ID, question set to use and time meeting was conducted <br />
          Then show questions from question set, recording each response from the beneficiary <br />
        </p>
        <hr />
        <h2>Start Meeting</h2>
        {this.renderNewMeetingControl(data.allOutcomeSets)}
      </div>
    );
  }
}

const Conduct = allOutcomeSets(newMeeting(ConductInner));
export { Conduct }
