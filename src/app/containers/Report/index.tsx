import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { Button, Grid, Message } from 'semantic-ui-react';
import {DateRangePicker} from 'components/DateRangePicker';
import {Hint} from 'components/Hint';
import {QuestionSetSelect} from 'components/QuestionSetSelect';
import { bindActionCreators } from 'redux';
import {RecordTagInput} from 'components/RecordTagInput';
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');
const ReactGA = require('react-ga');

interface IState {
  periodStart?: Date;
  periodEnd?: Date;
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
    };
    this.setDateRange = this.setDateRange.bind(this);
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.navigateToReport = this.navigateToReport.bind(this);
    this.renderNewReportControl = this.renderNewReportControl.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  private validateInput(): string|null {
    if (!this.state.questionSetID || this.state.questionSetID === '') {
      return 'A question set must be selected';
    }
    if (!this.state.periodStart || !this.state.periodEnd || this.state.periodStart >= this.state.periodEnd) {
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
    const encodeDatePathParam = ((d: Date): string => {
      // had lots of issues with full stops being present in path parameters...
      return d.toISOString().replace(/\.[0-9]{3}/, '');
    });
    const s = encodeDatePathParam(this.state.periodStart);
    const e = encodeDatePathParam(this.state.periodEnd);
    this.logGAEvent(this.dateDiff(this.state.periodStart,this.state.periodEnd));
    let queryParams;
    if (Array.isArray(this.state.tags) && this.state.tags.length > 0) {
      queryParams = `?tags=${JSON.stringify(this.state.tags)}`;
    }
    this.props.setURL(`/report/service/${this.state.questionSetID}/${s}/${e}`, queryParams);
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

  private logGAEvent(value: number) {
    ReactGA.event({
      category : 'servicereport',
      action : 'range',
      value,
    });
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

  private renderNewReportControl(): JSX.Element {
    return (
      <div className="impactform">
        <h3 className="label">Questionnaire</h3>
        <QuestionSetSelect onQuestionSetSelected={this.setQuestionSetID} />
        <h3 className="label"><Hint text={strings.JOCReportDateRange} />Date Range</h3>
        <DateRangePicker onSelect={this.setDateRange} future={false}/>
        <h3 className="label optional"><Hint text={strings.tagUsage} />Tags</h3>
        <RecordTagInput onChange={this.setTags} tags={this.state.tags} allowNewTags={false} />
        <Button className="submit" onClick={this.navigateToReport}>Generate</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }

  public render() {
    return (
      <Grid container columns={1} id="report">
        <Grid.Column>
          <Helmet>
            <title>Service Report</title>
          </Helmet>
          <h1>Service Report</h1>
          <Message info>
            <Message.Header>What does this report provide?</Message.Header>
            <p>The service report quantifies your organisation's impact on your beneficiaries.</p>
            <p>
              This is calculated by examining how much change there has been between each beneficiary's first ever recorded assessment (may be outside of the specified date range) and their most recent assessment within the provided time range.
              The average measurements from the first and most recent assessments, across all suitable beneficiaries, are compared and visualised.
            </p>
            <p>This report will only include beneficiaries with more than one assessment, so that the amount of change can be understood.</p>
          </Message>
          {this.renderNewReportControl()}
        </Grid.Column>
      </Grid>
    );
  }
}

export {Report}
