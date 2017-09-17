import * as React from 'react';
import 'url-search-params-polyfill';
import {GraphQLError} from '@types/graphql';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Checkbox, Message } from 'semantic-ui-react';
import {getJOCServiceReport, IReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from 'components/ServiceReportDetails';
import {ServiceReportRadar} from 'components/ServiceReportRadar';
import {ServiceReportTable} from 'components/ServiceReportTable';
import {renderArray} from 'helpers/react';
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
}

interface IState {
  categoryAg: boolean;
}

class ServiceReportInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      categoryAg: false,
    };
    this.toggleCategoryAggregation = this.toggleCategoryAggregation.bind(this);
    this.renderControlPanel = this.renderControlPanel.bind(this);
  }

  public componentWillReceiveProps(nextProps) {
    if (!this.isCategoryAggregationAvailable(nextProps) && this.state.categoryAg) {
      this.setState({
        categoryAg: false,
      });
    }
  }

  private isCategoryAggregationAvailable(props: IProp): boolean {
    if (props.JOCServiceReport.error || props.JOCServiceReport.loading) {
      return false;
    }
    return props.JOCServiceReport.getJOCServiceReport.categoryAggregates.first.length > 0;
  }

  private toggleCategoryAggregation() {
    this.setState({
      categoryAg: !this.state.categoryAg,
    });
  }

  private renderControlPanel(): JSX.Element {
    const cpItems: JSX.Element[] = [];
    if (this.isCategoryAggregationAvailable(this.props)) {
      cpItems.push((
        <span key="agtoggle">
          <Checkbox toggle label="Category Aggregation" onChange={this.toggleCategoryAggregation} checked={this.state.categoryAg} />
        </span>
      ));
    }
    return (
      <div id="cp">
        {cpItems}
      </div>
    );
  }

  private renderError(error: GraphQLError): JSX.Element {
    return (
      <p key={error.message}>
        {error.message}
      </p>
    );
  }

  public render() {
    console.log(this.props.JOCServiceReport);
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
          {this.renderControlPanel()}
          <ServiceReportTable serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} category={this.state.categoryAg} />
          <ServiceReportRadar serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} category={this.state.categoryAg} />
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
