import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {AssessmentTypeSelector} from 'components/AssessmentTypeSelector';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import './style.less';
import { AssessmentType } from 'models/assessment';
const { connect } = require('react-redux');

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class AssessmentTypeSelect extends React.Component<IURLConnector, any> {

  constructor(props) {
    super(props);
    this.typeSelected = this.typeSelected.bind(this);
  }

  private typeSelected(selected: AssessmentType) {
    this.props.setURL(`/record/${AssessmentType[selected]}`);
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="conduct">
        <Grid.Column>
          <Helmet title="Record"/>
          <h1>Create Record</h1>
          <AssessmentTypeSelector typeSelector={this.typeSelected}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export { AssessmentTypeSelect };
