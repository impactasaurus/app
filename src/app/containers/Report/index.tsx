import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IURLConnector, setURL} from 'redux/modules/url';
import { Button, Grid, Message, Radio } from 'semantic-ui-react';
import {DateRangePicker} from 'components/DateRangePicker';
import {Hint} from 'components/Hint';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import { bindActionCreators } from 'redux';
import {RecordTagInput} from 'components/RecordTagInput';
import {constructReportQueryParams, constructReportURL} from '../../helpers/report';
import './style.less';
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');
const ReactGA = require('react-ga');

interface IState {
  periodStart?: Date;
  periodEnd?: Date;
  all?: boolean;
  questionSetID?: string;
  error?: string;
  tags?: string[];
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Report extends React.Component<IURLConnector, IState> {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      all: true,
    };
    this.setDateRange = this.setDateRange.bind(this);
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.navigateToReport = this.navigateToReport.bind(this);
    this.renderNewReportControl = this.renderNewReportControl.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setAll = this.setAll.bind(this);
    this.logGAEvent = this.logGAEvent.bind(this);
  }

  private validateInput(): string|null {
    if (!this.state.questionSetID || this.state.questionSetID === '') {
      return 'A question set must be selected';
    }
    const invalidDates = !this.state.periodStart || !this.state.periodEnd || this.state.periodStart >= this.state.periodEnd;
    if (!this.state.all && invalidDates) {
      return 'Time range must be specified';
    }
    return null;
  }

  private navigateToReport() {
    const validation = this.validateInput();
    if (validation !== null) {
      this.setState({
        error: validation,
      });
      return;
    }
    let start = this.state.periodStart;
    let end = this.state.periodEnd;
    if (this.state.all) {
      start = new Date(0);
      end = new Date();
    }
    this.logGAEvent();
    const url = constructReportURL('service', start, end, this.state.questionSetID);
    const qp = constructReportQueryParams(this.state.tags, false);
    this.props.setURL(url, qp);
  }

  private dateDiff(date1, date2) {
    const oneDay = 1000*60*60*24;
    // converting both dates to milliseconds
    const firstMs = date1.getTime();
    const secondMs = date2.getTime();
    // calculate the difference
    const diff = secondMs - firstMs;
    // returning the number of weeks
    return(Math.round(diff/(oneDay*7)));

  }
  private setQuestionSetID(qsID) {
    this.setState({
      questionSetID: qsID,
    });
  }

  private logGAEvent() {
    if (this.state.all) {
      ReactGA.event({
        category : 'servicereport',
        action : 'all',
      });
    } else {
      const value = this.dateDiff(this.state.periodStart, this.state.periodEnd);
      ReactGA.event({
        category : 'servicereport',
        action : 'range',
        value,
      });
    }
  }

  private setDateRange(start: Date, end: Date) {
    this.setState({
      periodStart: start,
      periodEnd: end,
    });
  }

  private setTags(tags: string[]): void {
    this.setState({
      tags,
    });
  }

  private setAll(toSet: boolean) {
    return () => {
      this.setState({
        all: toSet,
      });
    };
  }

  private renderNewReportControl(): JSX.Element {
    let datePicker = <span />;
    if (!this.state.all) {
      datePicker = (
        <div>
          <DateRangePicker onSelect={this.setDateRange} future={false}/>
        </div>
      );
    }
    return (
      <div className="impactform">
        <h3 className="label">Questionnaire</h3>
        <QuestionSetSelect onQuestionSetSelected={this.setQuestionSetID} />
        <h3 className="label">Included Records</h3>
        <div id="filter-options">
          <Radio label="All" checked={this.state.all === true} onChange={this.setAll(true)} />
          <Radio label="Date Range" checked={this.state.all === false} onChange={this.setAll(false)} />
        </div>
        {datePicker}
        <h3 className="label optional"><Hint text={strings.tagUsage} />Tags</h3>
        <RecordTagInput onChange={this.setTags} tags={this.state.tags} allowNewTags={false} />
        <Button className="submit" onClick={this.navigateToReport}>Generate</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="report-picker">
        <Grid.Column>
          <Helmet>
            <title>Service Report</title>
          </Helmet>
          <h1>Service Report</h1>
          <Message info={true}>
            <Message.Header>What does this report provide?</Message.Header>

            <p>The service report quantifies your organisation's impact on your beneficiaries.</p>
            <p>
              This is calculated by examining how much change there has been between each beneficiary's first and last record within the report's time range.
              The average measurements from the first and last records, across all suitable beneficiaries, are compared and visualised.
            </p>
            <p>This report will only include beneficiaries with more than one assessment, so that the amount of change can be understood.</p>
          </Message>
          {this.renderNewReportControl()}
        </Grid.Column>
      </Grid>
    );
  }
}

export {Report};
