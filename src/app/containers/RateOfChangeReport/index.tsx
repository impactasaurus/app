import * as React from 'react';
import 'url-search-params-polyfill';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Message } from 'semantic-ui-react';
import {getROCReport, IROCReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {IStore} from 'redux/IStore';
import {renderArray} from 'helpers/react';
import {Aggregation, getAggregation} from 'models/pref';
import {RocReportBarChart} from 'components/RocReportBarChart';
import {RocReportDetails} from 'components/RocReportDetails';
import {VizControlPanel} from 'components/VizControlPanel';
const { connect } = require('react-redux');

interface IProp extends IROCReportResult {
  data: IOutcomeResult;
  match: {
    params: {
      questionSetID: string,
      start: string,
      end: string,
    },
  };
  location: {
    search: string,
  };
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
}

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.ROCReport.error || props.ROCReport.loading ||
    props.ROCReport.getROCReport === undefined || props.ROCReport.getROCReport.beneficiaries.length === 0) {
    return false;
  }
  return props.ROCReport.getROCReport.beneficiaries[0].categories.length > 0;
};

function renderError(error: string): JSX.Element {
  return (
    <p key={error}>
      {error}
    </p>
  );
}

@connect((state: IStore, ownProps: IProp) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps);
  return {
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
  };
}, undefined)
class RateOfChangeReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
  }

  public renderPage(): JSX.Element {
    const reportReq = this.props.ROCReport;
    if (reportReq.error) {
      return (
        <Message error={true}>
          {renderArray<string>(renderError, reportReq.error.graphQLErrors.map((e) => e.message))}
        </Message>
      );
    }
    if (this.props.data.loading || reportReq.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    const report = reportReq.getROCReport;
    const qs = this.props.data.getOutcomeSet;
    return (
      <div>
        <RocReportDetails report={report} questionSet={qs} />
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} showVizOptions={false} />
        <RocReportBarChart report={report} questionSet={qs} category={this.props.agg === Aggregation.CATEGORY} />
      </div>
    );
  }

  public render() {
    return (
      <Grid container={true} columns={1} id="roc-report">
        <Grid.Column>
          <Helmet>
            <title>Rate of Change Report</title>
          </Helmet>
          <h1>Rate of Change Report</h1>
          {this.renderPage()}
        </Grid.Column>
      </Grid>
    );
  }
}

function getQuestionSetIDFromProps(p: IProp): string {
  return p.match.params.questionSetID;
}

function getStartDateFromProps(p: IProp): string {
  return p.match.params.start;
}

function getEndDateFromProps(p: IProp): string {
  return p.match.params.end;
}

function getTagsFromProps(p: IProp): string[] {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('tags') === false) {
    return [];
  }
  const tags = urlParams.get('tags');
  return JSON.parse(tags);
}

const RateOfChangeReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getROCReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps)(RateOfChangeReportInner));
export {RateOfChangeReport};
