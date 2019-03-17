import * as React from 'react';
import 'url-search-params-polyfill';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Message } from 'semantic-ui-react';
import {getJOCServiceReport, IJOCReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from 'components/ServiceReportDetails';
import {ServiceReportRadar} from 'components/ServiceReportRadar';
import {ServiceReportTable} from 'components/ServiceReportTable';
import {VizControlPanel} from 'components/VizControlPanel';
import {Error} from 'components/Error';
import {IStore} from 'redux/IStore';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import './style.less';
import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {Link} from 'react-router-dom';
const { connect } = require('react-redux');

interface IProp extends IJOCReportResult, IURLConnector {
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
  vis?: Visualisation;
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
}

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.JOCServiceReport.error || props.JOCServiceReport.loading) {
    return false;
  }
  return props.JOCServiceReport.getJOCServiceReport.categories.length > 0;
};

@connect((state: IStore, ownProps: IProp) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps);
  const viz = getVisualisation(state.pref, false);
  return {
    vis: viz,
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    isCanvasSnapshotPossible: viz === Visualisation.RADAR,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class ServiceReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.exportReportData = this.exportReportData.bind(this);
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

  private exportReportData() {
    const {start, end, questionSetID} = this.props.match.params;
    const url = constructReportURL('export', new Date(start), new Date(end), questionSetID);
    const qp = constructReportQueryParams(getTagsFromProps(this.props), getOpenStartFromProps(this.props), getOrFromProps(this.props));
    this.props.setURL(url, qp);
  }

  private renderEmptyReport() {
    const unqiueExcludedBens = this.props.JOCServiceReport.getJOCServiceReport.excluded
      .filter((e) => e.beneficiary !== undefined)
      .filter((e, i, a) => a.indexOf(e) === i);
    if (unqiueExcludedBens.length > 0) {
      return (
        <Message warning={true}>
          <Message.Header>We Need More Records</Message.Header>
          <p>When generating your report, we only found beneficiaries with one record</p>
          <p>We need <b>at least two records</b> to understand the impact your intervention is having on a beneficiary</p>
          <p>Please collect more records and ensure that the time range you provided includes them</p>
        </Message>
      );
    }
    return (
      <Message warning={true}>
        <Message.Header>No Records</Message.Header>
        <div>
          <p>We couldn't generate your report as we found no records. This may be because:</p>
          <p>There are no records in the system, <Link to={'/record'}>click here to create some</Link></p>
          <p>or</p>
          <p>The report's time range didn't contain any records</p>
        </div>
      </Message>
    );

  }

  public render() {
    const wrapper = (inner: JSX.Element, questionnaireName?: string): JSX.Element => {
      let title = 'Impact Report';
      if (questionnaireName !== undefined) {
        title = questionnaireName + ' ' + title;
      }
      return (
        <Grid container={true} columns={1} id="service-report">
          <Grid.Column>
            <Helmet>
              <title>{title}</title>
            </Helmet>
            <div>
              <h1>{title}</h1>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };
    if (this.props.JOCServiceReport.error || this.props.data.error) {
      return wrapper(<Error text="Failed to load the report"/>);
    }
    if (this.props.data.loading || this.props.JOCServiceReport.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    if (this.props.JOCServiceReport.getJOCServiceReport && this.props.JOCServiceReport.getJOCServiceReport.beneficiaries.length === 0) {
      return wrapper(this.renderEmptyReport());
    }
    return wrapper((
      <div>
        <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} allowGraph={false} export={this.exportReportData} allowCanvasSnapshot={this.props.isCanvasSnapshotPossible} />
        {this.renderVis()}
      </div>
    ), this.props.data.getOutcomeSet.name);
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
  const parsedTags = JSON.parse(tags);
  return parsedTags;
}

function getOpenStartFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('open') === false) {
    return true;
  }
  return JSON.parse(urlParams.get('open'));
}

function getOrFromProps(p: IProp): boolean {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('or') === false) {
    return false;
  }
  return JSON.parse(urlParams.get('or'));
}

const ServiceReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps, getOpenStartFromProps, getOrFromProps)(ServiceReportInner));
export {ServiceReport};
