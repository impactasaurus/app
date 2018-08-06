import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Button, Grid, Form } from 'semantic-ui-react';
import {BeneficiaryInput} from 'components/BeneficiaryInput';
import { bindActionCreators } from 'redux';
import { IURLConnector, setURL } from 'redux/modules/url';
import { Hint } from 'components/Hint';
import './style.less';
import {isNullOrUndefined} from 'util';
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');

interface IState {
  enteredBenID?: string;
  error?: string;
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
    if (isNullOrUndefined(benID) || benID === '') {
      return this.setState({error: 'Please enter a beneficiary'});
    }
    this.props.setURL(`/beneficiary/${benID}`);
  }

  private setBenID(benID) {
    this.setState({
      enteredBenID: benID,
      error: undefined,
    });
  }

  public render() {
    return (
      <Grid container={true} columns={1} >
        <Grid.Column>
        <div id="reviewselector">
          <Helmet>
            <title>Review</title>
          </Helmet>
          <h1>Review</h1>
          <Form onSubmit={this.review}>
            <h3 className="label"><Hint text={strings.beneficiaryIDExplanation} />Beneficiary</h3>
            <BeneficiaryInput onChange={this.setBenID}/>
            <Button className="submit" type="submit">Review</Button>
            <span>{this.state.error}</span>
          </Form>
        </div>
        {this.props.children}
        </Grid.Column>
      </Grid>
    );
  }
}

export { ReviewSelector };
