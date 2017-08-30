import * as React from 'react';
import {IOutcomeResult, allOutcomeSets} from 'apollo/modules/outcomeSets';
import {IOutcomeSet} from 'models/outcomeSet';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Button, Select, Grid, SelectProps } from 'semantic-ui-react';
import {DateRangePicker} from 'components/DateRangePicker';
const { connect } = require('react-redux');

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
      return 'Question set ID is required';
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
    this.props.setURL(`/report/service/${this.state.questionSetID}?start=${this.state.periodStart.toISOString()}&end=${this.state.periodEnd.toISOString()}`);
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

  private setDateRange(start: moment.Moment, end: moment.Moment) {
    this.setState({
      periodStart: start.toDate(),
      periodEnd: end.toDate(),
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
        <h3 className="label">Date Range</h3>
        <DateRangePicker />
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
          <h1>Report</h1>
          {this.renderNewReportControl(data.allOutcomeSets)}
        </Grid.Column>
      </Grid>
    );
  }
}

const Report = allOutcomeSets(ReportInner);
export {Report}
