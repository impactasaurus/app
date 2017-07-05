import * as React from 'react';
import {MeetingView} from 'components/MeetingView';
import { Button, Input } from 'semantic-ui-react';
const style = require('./style.css');

interface IState {
  beneficiaryID?: string;
  enteredBenID?: string;
}

class Review extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.review = this.review.bind(this);
    this.showMeetingDetails = this.showMeetingDetails.bind(this);
    this.setBenID = this.setBenID.bind(this);
  }

  private review() {
    const benID = this.state.enteredBenID;
    this.setState({
      beneficiaryID: benID,
    });
  }

  private showMeetingDetails() {
    if(this.state.beneficiaryID === undefined) {
      return (<div />);
    }
    return (
      <MeetingView beneficiaryID={this.state.beneficiaryID} />
    );
  }

  private setBenID(_, data) {
    this.setState({
      enteredBenID: data.value,
    });
  }

  public render() {
    return (
      <div className={style.Home}>
        <p>
          Show outcome stars to beneficiaries here <br />
          Initially the beneficiary ID would be entered, this will load previous meetings from the database <br />
          A outcome radar graph will be shown, displaying the relative differences between meetings <br />
          Visualisation of meetings can be toggled. Also meetings will be able to be deleted from here <br />
        </p>
        <hr />
        <Input type="text" placeholder="Beneficiary ID" onChange={this.setBenID}/>
        <Button onClick={this.review}>Review</Button>
        <hr />
        {this.showMeetingDetails()}
      </div>
    );
  }
}

export { Review }
