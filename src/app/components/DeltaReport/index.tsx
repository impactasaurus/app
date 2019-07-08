import * as React from 'react';
import {getDeltaReport, IDeltaReportResult} from 'apollo/modules/reports';
import {getOutcomeSet, IOutcomeResult} from 'apollo/modules/outcomeSets';
import {IStore} from 'redux/IStore';
import {Aggregation, getAggregation, getVisualisation, Visualisation} from 'models/pref';
import './style.less';
import {
  exportReportData, IReportOptions,
  renderEmptyReport,
} from 'containers/Report/helpers';
import {ApolloLoaderHoC} from 'components/ApolloLoaderHoC';
import {VizControlPanel} from 'components/VizControlPanel';
import {DeltaReportStackedBarGraph} from './bar';
import {DeltaReportDetails} from './details';
import {DeltaTable} from './table';
import {IURLConnector, setURL} from 'redux/modules/url';
import {bindActionCreators} from 'redux';
import {Message} from 'semantic-ui-react';

const { connect } = require('react-redux');

const allowedVisualisations = [Visualisation.BAR, Visualisation.TABLE];

interface IProp extends IDeltaReportResult, IURLConnector, IReportOptions {
  data?: IOutcomeResult;
  vis?: Visualisation;
  agg?: Aggregation;

  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
}

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.DeltaReport.error || props.DeltaReport.loading) {
    return false;
  }
  return props.DeltaReport.getDeltaReport.categories.length > 0;
};

@connect((state: IStore, ownProps: IProp) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps);
  const viz = getVisualisation(state.pref, allowedVisualisations);
  return {
    vis: viz,
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    isCanvasSnapshotPossible: viz === Visualisation.BAR,
  };
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class DeltaReportInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.export = this.export.bind(this);
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (p.vis === Visualisation.BAR) {
      return <DeltaReportStackedBarGraph report={p.DeltaReport.getDeltaReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />;
    } else {
      return <DeltaTable report={p.DeltaReport.getDeltaReport} questionSet={p.data.getOutcomeSet} category={p.agg === Aggregation.CATEGORY} />;
    }
  }

  private export() {
    exportReportData(this.props, this.props);
  }

  public render() {
    if (this.props.DeltaReport.getDeltaReport && this.props.DeltaReport.getDeltaReport.beneficiaries.length === 0) {
      return renderEmptyReport(this.props.DeltaReport.getDeltaReport.excluded);
    }
    return (
      <div>
        <Message warning={true}>
          This is a new report which is still undergoing evaluation, <a href="mailto:support@impactasaurus.org?subject=change-report">we would love to know what you think</a>
        </Message>
        <DeltaReportDetails report={this.props.DeltaReport.getDeltaReport} questionnaire={this.props.data.getOutcomeSet} />
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

const DeltaInnerWithSpinner = ApolloLoaderHoC<IProp>('report', (p: IProp) => p.DeltaReport, DeltaReportInner);
const DeltaInnerWithSpinners = ApolloLoaderHoC('questionnaire', (p: IProp) => p.data, DeltaInnerWithSpinner);

const DeltaInnerWithReport = getDeltaReport<IProp>(
  (p) => p.questionnaire,
  (p) => p.start.toISOString(),
  (p) => p.end.toISOString(),
  (p) => p.tags,
  (p) => p.openStart,
  (p) => p.orTags)(DeltaInnerWithSpinners);
const DeltaReport = getOutcomeSet<IProp>((p) => p.questionnaire)(DeltaInnerWithReport);

export {DeltaReport};
