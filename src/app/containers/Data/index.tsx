import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Button } from 'semantic-ui-react';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import {IURLConnector, setURL} from '../../redux/modules/url';
import {bindActionCreators} from 'redux';
import {isNullOrUndefined} from 'util';
import './style.less';
const { connect } = require('react-redux');

interface IState {
  selectedQuestionnaire: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Data extends React.Component<IURLConnector, IState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedQuestionnaire: undefined,
    };
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
    this.goToExport = this.goToExport.bind(this);
  }

  private setQuestionSetID(qsID: string) {
    this.setState({
      selectedQuestionnaire: qsID,
    });
  }

  private goToExport() {
    this.props.setURL(`/settings/data/questionnaire/export/${this.state.selectedQuestionnaire}`);
  }

  public render() {
    return (
      <Grid container columns={1} id="data">
        <Grid.Column>
          <Helmet>
            <title>Data</title>
          </Helmet>
          <h1>Data</h1>
          <h3>Export</h3>
          <p>Export all the records associated with a questionnaire to CSV (compatible with Excel):</p>
          <QuestionSetSelect onQuestionSetSelected={this.setQuestionSetID} />
          <Button disabled={isNullOrUndefined(this.state.selectedQuestionnaire)} onClick={this.goToExport}>Export</Button>
          <h3>Import</h3>
          <p>To import large amounts of data into Impactasaurus, please email <a href="mailto:support@impactasaurus.org?Subject=Import">support@impactasaurus.org</a></p>
        </Grid.Column>
      </Grid>
    );
  }
}

export { Data }
