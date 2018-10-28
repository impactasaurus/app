import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid } from 'semantic-ui-react';
import {AssessmentTypeSelector} from 'components/AssessmentTypeSelector';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import './style.less';
import { AssessmentType } from 'models/assessment';
const { connect } = require('react-redux');

interface IProps extends IURLConnector {
  location: {
    search: string,
    pathname: string,
  };
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class AssessmentTypeSelect extends React.Component<IProps, any> {

  constructor(props) {
    super(props);
    this.typeSelected = this.typeSelected.bind(this);
  }

  private typeSelected(selected: AssessmentType) {
    this.props.setURL(`${this.props.location.pathname}/${AssessmentType[selected]}`, this.props.location.search);
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="conduct">
        <Grid.Column>
          <Helmet title="New Record"/>
          <h1>New Record</h1>
          <AssessmentTypeSelector typeSelector={this.typeSelected}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export { AssessmentTypeSelect };
