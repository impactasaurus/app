import * as React from 'react';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import { Button, Select, Grid, SelectProps, Message } from 'semantic-ui-react';
import {DateRangePicker} from 'components/DateRangePicker';
import {Hint} from 'components/Hint';
const { connect } = require('react-redux');
const strings = require('./../../../strings.json');

interface IProp extends IURLConnector {
  data: IOutcomeResult;
}

interface IState {
  periodStart?: Date;
  periodEnd?: Date;
  questionSetID?: string;
  error?: string;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ReportInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {};
    this.setDateRange = this.setDateRange.bind(this);
    this.setQuestionSetID = this.setQuestionSetID.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.navigateToReport = this.navigateToReport.bind(this);
    this.renderNewReportControl = this.renderNewReportControl.bind(this);
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
    this.props.setURL(`/report/service/${this.state.questionSetID}/${s}/${e}`);
  }

  private getOptions(oss: IOutcomeSet[]): any[] {
    if (oss === undefined) {
      return [];
    }
    return oss.map((os) => {
      return {
        key: os.id,
        value: os.id,
        text: os.name,
      };
    });
  }

  private setQuestionSetID(_, data) {
    this.setState({
      questionSetID: data.value,
    });
  }

  private setDateRange(start: Date, end: Date) {
    this.setState({
      periodStart: start,
      periodEnd: end,
    });
  }

  private renderNewReportControl(outcomeSets: IOutcomeSet[]|undefined): JSX.Element {
    const selectProps: SelectProps = {};
    if (this.props.data.loading) {
      selectProps.loading = true;
      selectProps.disabled = true;
    }
    return (
      <div className="impactform">
        <h3 className="label">Question Set</h3>
        <Select {...selectProps} placeholder="Question Set" onChange={this.setQuestionSetID} options={this.getOptions(outcomeSets)} />
        <h3 className="label"><Hint text={strings.JOCReportDateRange} />Date Range</h3>
        <DateRangePicker onSelect={this.setDateRange} future={false}/>
        <Button className="submit" onClick={this.navigateToReport}>Generate</Button>
        <p>{this.state.error}</p>
      </div>
    );
  }

  public render() {
    const { data } = this.props;
    return (
      <Grid container columns={1} id="report">
        <Grid.Column>
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
          {this.renderNewReportControl(data.allOutcomeSets)}
        </Grid.Column>
      </Grid>
    );
  }
}

const Report = allOutcomeSets(ReportInner);
export {Report}
