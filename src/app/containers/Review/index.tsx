import * as React from 'react';
import {MeetingView} from 'components/MeetingView';
import { Button, Input } from 'semantic-ui-react';
const style = require('./style.css');

interface IState {
  beneficiaryID?: string;
}

class Review extends React.Component<any, IState> {

  private beneficiaryControl: React.HTMLAttributes<string>;

  constructor(props) {
    super(props);
    this.state = {};
    this.setRef = this.setRef.bind(this);
    this.review = this.review.bind(this);
    this.showMeetingDetails = this.showMeetingDetails.bind(this);
  }

  private setRef(attrName: string) {
    return (input) => {this[attrName] = input;};
  }

  private review() {
    const benID = this.beneficiaryControl.value as string;
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
        <Input type="text" placeholder="Beneficiary ID" ref={this.setRef('beneficiaryControl')}/>
        <Button onClick={this.review}>Review</Button>
        <hr />
        {this.showMeetingDetails()}
      </div>
    );
  }
}

export { Review }
