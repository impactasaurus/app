import * as React from 'react';
import 'url-search-params-polyfill';
import {GraphQLError} from '@types/graphql';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Message } from 'semantic-ui-react';
import {getROCReport, IROCReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {IStore} from 'redux/IStore';
import {renderArray} from 'helpers/react';
import {Aggregation, getAggregation} from 'models/pref';
import {RocReportBarChart} from 'components/RocReportBarChart';
const { connect } = require('react-redux');

interface IProp extends IROCReportResult {
  data: IOutcomeResult;
  params: {
    questionSetID: string,
    start: string,
    end: string,
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
  return props.ROCReport.getROCReport.beneficiaries[0].categoryROCs.length > 0;
};

function renderError(error: GraphQLError): JSX.Element {
  return (
    <p key={error.message}>
      {error.message}
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
    if (this.props.ROCReport.error) {
      return (
        <Message error>
          {renderArray(renderError, this.props.ROCReport.error.graphQLErrors)}
        </Message>
      );
    }
    if (this.props.data.loading || this.props.ROCReport.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <div>
        <RocReportBarChart report={this.props.ROCReport.getROCReport} questionSet={this.props.data.getOutcomeSet}/>
        <p>{JSON.stringify(this.props.ROCReport)}</p>
      </div>
    );
  }

  public render() {
    return (
      <Grid container columns={1} id="roc-report">
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
  return p.params.questionSetID;
}

function getStartDateFromProps(p: IProp): string {
  return p.params.start;
}

function getEndDateFromProps(p: IProp): string {
  return p.params.end;
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
export {RateOfChangeReport}
