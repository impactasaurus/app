import * as React from 'react';
import 'url-search-params-polyfill';
import { Helmet } from 'react-helmet';
import { Grid, Loader, Message } from 'semantic-ui-react';
import { getLatestReport, ILatestReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from 'components/ServiceReportDetails';
import {ServiceReportTable} from 'components/ServiceReportTable';
import {VizControlPanel} from 'components/VizControlPanel';
import {Error} from 'components/Error';
import {IStore} from 'redux/IStore';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import {constructReportQueryParams, constructReportURL} from 'helpers/report';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {Link} from 'react-router-dom';
import {LatestReportRadar} from '../../components/LatestReportRadar';
const { connect } = require('react-redux');

interface IProp extends ILatestReportResult, IURLConnector {
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
  if (props.LatestReport.error || props.LatestReport.loading) {
    return false;
  }
  return props.LatestReport.getLatestReport.categories.length > 0;
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
class LatestReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.exportReportData = this.exportReportData.bind(this);
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (p.vis === Visualisation.RADAR) {
      return (
        <LatestReportRadar serviceReport={p.LatestReport.getLatestReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />
      );
    }
    return (
      <ServiceReportTable serviceReport={p.LatestReport.getLatestReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />
    );
  }

  private exportReportData() {
    const {start, end, questionSetID} = this.props.match.params;
    const url = constructReportURL('export', new Date(start), new Date(end), questionSetID);
    const qp = constructReportQueryParams(getTagsFromProps(this.props), true);
    this.props.setURL(url, qp);
  }

  private renderEmptyReport() {
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
      let title = 'Latest Report';
      if (questionnaireName !== undefined) {
        title = questionnaireName + ' ' + title;
      }
      return (
        <Grid container={true} columns={1} id="latest-report">
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
    if (this.props.LatestReport.error || this.props.data.error) {
      return wrapper(<Error text="Failed to load the report"/>);
    }
    if (this.props.data.loading || this.props.LatestReport.loading) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    if (this.props.LatestReport.getLatestReport && this.props.LatestReport.getLatestReport.beneficiaries.length === 0) {
      return wrapper(this.renderEmptyReport());
    }
    return wrapper((
      <div>
        <ServiceReportDetails serviceReport={this.props.LatestReport.getLatestReport} questionSet={this.props.data.getOutcomeSet} />
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

const LatestReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getLatestReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps)(LatestReportInner));
export {LatestReport};
