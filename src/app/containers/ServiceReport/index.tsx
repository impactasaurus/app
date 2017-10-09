import * as React from 'react';
import 'url-search-params-polyfill';
import {GraphQLError} from '@types/graphql';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Message } from 'semantic-ui-react';
import {getJOCServiceReport, IReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from 'components/ServiceReportDetails';
import {ServiceReportRadar} from 'components/ServiceReportRadar';
import {ServiceReportTable} from 'components/ServiceReportTable';
import {VizControlPanel} from 'components/VizControlPanel';
const { connect } = require('react-redux');
import {IStore} from 'redux/IStore';
import {renderArray} from 'helpers/react';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import './style.less';

interface IProp extends IReportResult {
  data: IOutcomeResult;
  params: {
      questionSetID: string,
      start: string,
      end: string,
  };
  location: {
    search: string,
  };
  vis?: Visualisation;
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
}

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.JOCServiceReport.error || props.JOCServiceReport.loading) {
    return false;
  }
  return props.JOCServiceReport.getJOCServiceReport.categoryAggregates.first.length > 0;
};

@connect((state: IStore, ownProps: IProp) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps);
  return {
    vis: getVisualisation(state.pref),
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
  };
}, undefined)
class ServiceReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
  }

  private renderError(error: GraphQLError): JSX.Element {
    return (
      <p key={error.message}>
        {error.message}
      </p>
    );
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (p.vis === Visualisation.RADAR) {
      return (
        <ServiceReportRadar serviceReport={p.JOCServiceReport.getJOCServiceReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />
      );
    }
    return (
      <ServiceReportTable serviceReport={p.JOCServiceReport.getJOCServiceReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />
    );
  }

  public render() {
    if (this.props.JOCServiceReport.error) {
      return (
        <Grid container columns={1} id="service-report">
          <Grid.Column>
            <Message error>
              {renderArray(this.renderError, this.props.JOCServiceReport.error.graphQLErrors)}
            </Message>
          </Grid.Column>
        </Grid>
      );
    }
    if (this.props.data.loading || this.props.JOCServiceReport.loading) {
      return (
        <Loader active={true} inline="centered" />
      );
    }
    return (
      <Grid container columns={1} id="service-report">
        <Grid.Column>
          <Helmet>
            <title>Service Report</title>
          </Helmet>
          <h1>Service Report</h1>
          <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
          <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} />
          {this.renderVis()}
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

const ServiceReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps)(ServiceReportInner));
export {ServiceReport}
