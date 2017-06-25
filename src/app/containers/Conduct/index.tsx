import * as React from 'react';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets} from 'redux/modules/outcomeSets';
import {IMeetingMutation, newMeeting} from 'redux/modules/meetings';
import {IOutcomeSet} from 'models/outcomeSet';
import {renderArray} from 'helpers/react';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
const { connect } = require('react-redux');
const style = require('./style.css');

interface IProp extends IOutcomeMutation, IMeetingMutation, IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  startMeetingError: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ConductInner extends React.Component<IProp, IState> {

  private beneficiaryControl: React.HTMLAttributes<string>;
  private outcomeSetControl: React.HTMLAttributes<string>;

  constructor(props) {
    super(props);
    this.state = {
      startMeetingError: undefined,
    };
    this.setRef = this.setRef.bind(this);
    this.renderNewMeetingControl = this.renderNewMeetingControl.bind(this);
    this.startMeeting = this.startMeeting.bind(this);
  }

  private setRef(attrName: string) {
    return (input) => {this[attrName] = input;};
  }

  private startMeeting() {
    const benID = this.beneficiaryControl.value as string;
    const osID = this.outcomeSetControl.value as string;
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

  private renderOutcomeSet(os: IOutcomeSet): JSX.Element {
    return (
      <option value={os.id} key={os.id}>{os.name}</option>
    );
  }

  private renderNewMeetingControl(outcomeSets: IOutcomeSet[]|undefined): JSX.Element {
    return (
      <div>
        <input type="text" placeholder="Beneficiary ID" ref={this.setRef('beneficiaryControl')}/>
        <select placeholder="Outcome Set" ref={this.setRef('outcomeSetControl')}>
          {renderArray(this.renderOutcomeSet, outcomeSets)}
        </select>
        <button onClick={this.startMeeting}>Start</button>
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
