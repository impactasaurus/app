import * as React from 'react';
import { Button, Input } from 'semantic-ui-react';
import './style.less';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IURLConnector} from 'redux/modules/url';
const { connect } = require('react-redux');

interface IState {
  enteredBenID?: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ReviewSelector extends React.Component<IURLConnector, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.review = this.review.bind(this);
    this.setBenID = this.setBenID.bind(this);
  }

  private review() {
    const benID = this.state.enteredBenID;
    this.props.setURL(`/review/${benID}`);
  }

  private setBenID(_, data) {
    this.setState({
      enteredBenID: data.value,
    });
  }

  public render() {
    return (
      <div id="reviewselector">
        <h1>Review</h1>
        <h3 className="label">Beneficiary ID</h3>
        <Input type="text" placeholder="Beneficiary ID" onChange={this.setBenID}/>
        <Button className="submit" onClick={this.review}>Review</Button>
        {this.props.children}
      </div>
    );
  }
}

export { ReviewSelector }
