import * as React from 'react';
import {IOutcomeResult, IOutcomeMutation, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IMeetingMutation, newMeeting} from 'apollo/modules/meetings';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Button, Select, Input } from 'semantic-ui-react';
import {DateTimePicker} from 'components/DateTimePicker';
import './style.less';
const { connect } = require('react-redux');

interface IProp extends IOutcomeMutation, IMeetingMutation, IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  startMeetingError?: string;
  selectedOS?: string;
  selectedBenID?: string;
  conducted?: moment.Moment;
  dateSelectionError?: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ConductInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      startMeetingError: undefined,
      conducted: moment(),
    };
    this.renderNewMeetingControl = this.renderNewMeetingControl.bind(this);
    this.startMeeting = this.startMeeting.bind(this);
    this.setOS = this.setOS.bind(this);
    this.setBenID = this.setBenID.bind(this);
    this.setConductedDate = this.setConductedDate.bind(this);
  }

  private startMeeting() {
    const benID = this.state.selectedBenID;
    const osID = this.state.selectedOS;
    const conducted = this.state.conducted;
    this.props.newMeeting(benID, osID, conducted.toDate())
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

  private setConductedDate(date: moment.Moment) {
    if (date > moment()) {
      this.setState({
        dateSelectionError: 'Conducted date must be in the past',
        conducted: this.state.conducted,
      });
      return;
    }
    this.setState({
      conducted: date,
      dateSelectionError: undefined,
    });
  }

  private renderNewMeetingControl(outcomeSets: IOutcomeSet[]|undefined): JSX.Element {
    const conductedCopy = this.state.conducted.clone();
    return (
      <div>
        <h3 className="label">Beneficiary ID</h3>
        <Input type="text" placeholder="Beneficiary ID" onChange={this.setBenID} />
        <h3 className="label">Question Set</h3>
        <Select placeholder="Outcome Set" onChange={this.setOS} options={this.getOptions(outcomeSets)} />
        <h3 className="label">Date Conducted</h3>
        <span className="conductedDate">{this.state.conducted.format('llll')}</span>
        <DateTimePicker moment={conductedCopy} onChange={this.setConductedDate}/>
        <p>{this.state.dateSelectionError}</p>
        <Button className="submit" onClick={this.startMeeting}>Start</Button>
        <p>{this.state.startMeetingError}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    return (
      <div id="conduct">
        <h1>Conduct Meeting</h1>
        {this.renderNewMeetingControl(data.allOutcomeSets)}
      </div>
    );
  }
}

const Conduct = allOutcomeSets(newMeeting(ConductInner));
export { Conduct }
