import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IURLConnector, setURL} from 'redux/modules/url';
import { Grid } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import {constructReportQueryParams, constructReportURL} from '../../helpers/report';
import {IFormOutput, ReportForm as RFComponent} from 'components/ReportForm';
import {QuestionnaireRequired} from 'components/QuestionnaireRequired';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

const ReportForm = QuestionnaireRequired('To generate a report', RFComponent);

const dateDiff = (date1: Date, date2: Date): number => {
  const oneDay = 1000*60*60*24;
  // converting both dates to milliseconds
  const firstMs = date1.getTime();
  const secondMs = date2.getTime();
  // calculate the difference
  const diff = secondMs - firstMs;
  // returning the number of weeks
  return(Math.round(diff/(oneDay*7)));
};

const logGAEvent = (v: IFormOutput): void => {
  if (v.all) {
    ReactGA.event({
      category : 'servicereport',
      action : 'all',
    });
  } else {
    const value = dateDiff(v.start, v.end);
    ReactGA.event({
      category : 'servicereport',
      action : 'range',
      value,
    });
  }
};

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Report extends React.Component<IURLConnector, any> {

  constructor(props) {
    super(props);
    this.navigateToReport = this.navigateToReport.bind(this);
  }

  private navigateToReport(v: IFormOutput) {
    let start = v.start;
    let end = v.end;
    if (v.all) {
      start = new Date(0);
      end = new Date();
    }
    logGAEvent(v);
    const url = constructReportURL('service', start, end, v.questionSetID);
    const qp = constructReportQueryParams(v.tags, false);
    this.props.setURL(url, qp);
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="report-picker">
        <Grid.Column>
          <Helmet>
            <title>Impact Report</title>
          </Helmet>
          <h1>Impact Report</h1>
          <ReportForm onFormSubmit={this.navigateToReport} />
        </Grid.Column>
      </Grid>
    );
  }
}

export {Report};
