import * as React from 'react';
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
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {
  exportReportData,
  getEndDateFromProps, getOpenStartFromProps, getOrFromProps,
  getQuestionSetIDFromProps,
  getStartDateFromProps, getTagsFromProps,
  IReportProps, renderEmptyReport,
} from 'containers/Report/helpers';
const { connect } = require('react-redux');

interface IProp extends IJOCReportResult, IURLConnector, IReportProps {
  data: IOutcomeResult;
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
    this.export = this.export.bind(this);
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

  private export() {
    exportReportData(this.props, this.props);
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
      return wrapper(renderEmptyReport(this.props.JOCServiceReport.getJOCServiceReport.excluded));
    }
    return wrapper((
      <div>
        <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
        <VizControlPanel canCategoryAg={this.props.isCategoryAgPossible} allowGraph={false} export={this.export} allowCanvasSnapshot={this.props.isCanvasSnapshotPossible} />
        {this.renderVis()}
      </div>
    ), this.props.data.getOutcomeSet.name);
  }
}

const ServiceReport = getOutcomeSet<IProp>(getQuestionSetIDFromProps)(getJOCServiceReport<IProp>(getQuestionSetIDFromProps, getStartDateFromProps, getEndDateFromProps, getTagsFromProps, getOpenStartFromProps, getOrFromProps)(ServiceReportInner));
export {ServiceReport};
