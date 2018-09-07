import * as React from 'react';
import 'url-search-params-polyfill';
import { Helmet } from 'react-helmet';
import { Grid, Loader } from 'semantic-ui-react';
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
    const qp = constructReportQueryParams(getTagsFromProps(this.props), true);
    this.props.setURL(url, qp);
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="service-report">
          <Grid.Column>
            <Helmet>
              <title>Service Report</title>
            </Helmet>
            <div>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };
    if (this.props.JOCServiceReport.error) {
      return wrapper(<Error text="Failed to load the report"/>);
    }
    if (this.props.data.loading || this.props.JOCServiceReport.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    return wrapper((
      <div>
        <h1>Service Report</h1>
        <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} allowGraph={false} export={this.exportReportData} allowCanvasSnapshot={this.props.isCanvasSnapshotPossible} />
        {this.renderVis()}
      </div>
    ));
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

const ServiceReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps, getOpenStartFromProps)(ServiceReportInner));
export {ServiceReport};
