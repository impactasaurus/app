import * as React from 'react';
import {IURLConnector, setURL} from 'redux/modules/url';
import { bindActionCreators } from 'redux';
import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {IFormOutput, ReportForm as RFComponent} from 'components/ReportForm';
import {QuestionnaireRequired} from 'components/QuestionnaireRequired';
import {PageWrapperHoC} from 'components/PageWrapperHoC';
const { connect } = require('react-redux');
const ReactGA = require('react-ga');

const RFWrapped = QuestionnaireRequired('generate a report', RFComponent);

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
class ReportFormInner extends React.Component<IURLConnector, any> {

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
    const qp = constructReportQueryParams(v.tags, false, v.orTags);
    this.props.setURL(url, qp);
  }

  public render() {
    return (
      <RFWrapped onFormSubmit={this.navigateToReport} />
    );
  }
}

const ReportForm = PageWrapperHoC('Report', 'report-form-page', ReportFormInner);
export {ReportForm};
