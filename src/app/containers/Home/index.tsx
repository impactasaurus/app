import * as React from 'react';
import { Helmet } from 'react-helmet';
import { FancyBox } from 'components/FancyBox';
import {IURLConnector, setURL} from 'redux/modules/url';
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
      <Grid container={true} columns={1} id="home">
        <Grid.Column>
          <Helmet>
            <title>Home</title>
          </Helmet>
          <FancyBox text="Capture answers to a questionnaire" title="Create Record" icon="edit" onClick={this.navigate('/record')} />
          <FancyBox text="View an individual's records over time" title="Review Beneficiary" icon="user" onClick={this.navigate('/beneficiary')} />
          <FancyBox text="Get a report that quantifies your organisation's impact" title="Generate Report" icon="chart bar" onClick={this.navigate('/report')} />
        </Grid.Column>
      </Grid>
    );
  }
}

export { Home };
