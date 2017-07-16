import * as React from 'react';
import { FancyBox } from 'components/FancyBox';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react';
const { connect } = require('react-redux');

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Home extends React.Component<IURLConnector, any> {

  private navigate(url: string): React.EventHandler<any> {
    return () => {
      this.props.setURL(url);
    };
  }

  public render() {
    return (
      <Grid container columns={1} id="conduct">
        <Grid.Column>
          <FancyBox text="Define questions to quantify how much you are aiding your organisation's beneficiaries" title="Define" icon="edit" onClick={this.navigate('/settings/questions')}/>
          <FancyBox text="Conduct meetings during your involvement with a beneficiary" title="Capture" icon="checkmark box" onClick={this.navigate('/conduct')} />
          <FancyBox text="Report on an individual's journey of change, providing a sense of achievement and progress" title="Review" icon="area chart" onClick={this.navigate('/review')} />
        </Grid.Column>
      </Grid>
    );
  }
}

export { Home }
