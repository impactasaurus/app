import React from "react";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { IStore } from "redux/IStore";
import {
  Aggregation,
  getAggregation,
  getVisualisation,
  Visualisation,
} from "models/pref";
import {
  exportReportData,
  IReportOptions,
  EmptyReportMessage,
  IUserReportOptions,
} from "containers/Report/helpers";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { VizControlPanel } from "components/VizControlPanel";
import { DeltaReportStackedBarGraph } from "./bar";
import { DeltaReportDetails } from "./details";
import { DeltaTable } from "./table";
import { IURLConnector, setURL } from "redux/modules/url";
import { bindActionCreators } from "redux";
import { getReport, IReportResponse } from "apollo/modules/reports";

const { connect } = require("react-redux");

const allowedVisualisations = [Visualisation.BAR, Visualisation.TABLE];

interface IProp extends IURLConnector, IUserReportOptions {
  data?: IOutcomeResult;
  report?: IReportResponse;
  vis?: Visualisation;
  agg?: Aggregation;

  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
}

const reportOpts = (p: IProp): IReportOptions => ({ minRecords: 2, ...p });

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.report.error || props.report.loading) {
    return false;
  }
  return props.report.getReport.categories.length > 0;
};

@connect(
  (state: IStore, ownProps: IProp) => {
    const canCatAg = isCategoryAggregationAvailable(ownProps);
    const viz = getVisualisation(state.pref, allowedVisualisations);
    return {
      vis: viz,
      agg: getAggregation(state.pref, canCatAg),
      isCategoryAgPossible: canCatAg,
      isCanvasSnapshotPossible: viz === Visualisation.BAR,
    };
  },
  (dispatch) => ({
    setURL: bindActionCreators(setURL, dispatch),
  })
)
class DeltaReportInner extends React.Component<IProp, any> {
  constructor(props) {
    super(props);
    this.renderVis = this.renderVis.bind(this);
    this.export = this.export.bind(this);
  }

  private renderVis(): JSX.Element {
    const p = this.props;
    if (p.vis === Visualisation.BAR) {
      return (
        <DeltaReportStackedBarGraph
          report={p.report.getReport}
          questionSet={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    } else {
      return (
        <DeltaTable
          report={p.report.getReport}
          questionSet={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    }
  }

  private export() {
    exportReportData(this.props.setURL, reportOpts(this.props));
  }

  public render() {
    if (
      this.props.report.getReport &&
      this.props.report.getReport.beneficiaries.length === 0
    ) {
      return <EmptyReportMessage ie={this.props.report.getReport.excluded} />;
    }
    return (
      <div>
        <DeltaReportDetails
          report={this.props.report.getReport}
          questionnaire={this.props.data.getOutcomeSet}
        />
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

// t("report")
const DeltaInnerWithSpinner = ApolloLoaderHoC<IProp>(
  "report",
  (p: IProp) => p.report,
  DeltaReportInner
);
// t("questionnaire")
const DeltaInnerWithSpinners = ApolloLoaderHoC(
  "questionnaire",
  (p: IProp) => p.data,
  DeltaInnerWithSpinner
);

const DeltaInnerWithReport = getReport<IProp>(
  (p) => reportOpts(p),
  "report"
)(DeltaInnerWithSpinners);
const DeltaReport = getOutcomeSet<IUserReportOptions>((p) => p.questionnaire)(
  DeltaInnerWithReport
);

export { DeltaReport };
