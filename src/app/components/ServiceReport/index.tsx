import * as React from 'react';
import {getJOCServiceReport, IJOCReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {ServiceReportDetails} from './details';
import {ServiceReportRadar} from './radar';
import {ServiceReportTable} from './table';
import {VizControlPanel} from 'components/VizControlPanel';
import {IStore} from 'redux/IStore';
import {Aggregation, Visualisation, getAggregation, getVisualisation} from 'models/pref';
import './style.less';
import {bindActionCreators} from 'redux';
import {IURLConnector, setURL} from 'redux/modules/url';
import {
  exportReportData, IReportOptions, renderEmptyReport,
} from 'containers/Report/helpers';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
const { connect } = require('react-redux');

const allowedVisualisations = [Visualisation.RADAR, Visualisation.TABLE];

interface IProp extends IJOCReportResult, IURLConnector, IReportOptions {
  data?: IOutcomeResult;
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
  const viz = getVisualisation(state.pref, allowedVisualisations);
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
    if (this.props.JOCServiceReport.getJOCServiceReport && this.props.JOCServiceReport.getJOCServiceReport.beneficiaries.length === 0) {
      return renderEmptyReport(this.props.JOCServiceReport.getJOCServiceReport.excluded);
    }
    return (
      <div>
        <ServiceReportDetails serviceReport={this.props.JOCServiceReport.getJOCServiceReport} questionSet={this.props.data.getOutcomeSet} />
        <VizControlPanel
          canCategoryAg={this.props.isCategoryAgPossible}
          visualisations={allowedVisualisations}
          export={this.export}
          allowCanvasSnapshot={this.props.isCanvasSnapshotPossible}
        />
        {this.renderVis()}
      </div>
    );
  }
}

const ServiceInnerWithSpinner = ApolloLoaderHoC<IProp>('report', (p: IProp) => p.JOCServiceReport, ServiceReportInner);
const ServiceInnerWithSpinners = ApolloLoaderHoC('questionnaire', (p: IProp) => p.data, ServiceInnerWithSpinner);

const ServiceInnerWithReport = getJOCServiceReport<IProp>(
  (p) => p.questionnaire,
  (p) => p.start.toISOString(),
  (p) => p.end.toISOString(),
  (p) => p.tags,
  (p) => p.openStart,
  (p) => p.orTags)(ServiceInnerWithSpinners);
const ServiceReport = getOutcomeSet<IProp>((p) => p.questionnaire)(ServiceInnerWithReport);

export {ServiceReport};
