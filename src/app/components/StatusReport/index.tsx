import React from "react";
import { getStatusReport, IStatusReport } from "apollo/modules/reports";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { StatusReportRadar } from "./radar";
import { StatusReportTable } from "./table";
import { StatusReportDetails } from "./details";
import { VizControlPanel } from "components/VizControlPanel";
import { IStore } from "redux/IStore";
import {
  Aggregation,
  Visualisation,
  getAggregation,
  getVisualisation,
} from "models/pref";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import { IReportOptions, NoRecordsMessage } from "containers/Report/helpers";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { connect } from "react-redux";
import { StatusReportDistribution } from "./distribution";
import { constructReportQueryParams } from "helpers/report";

const allowedVisualisations = [
  Visualisation.RADAR,
  Visualisation.BAR,
  Visualisation.TABLE,
];

interface IProp extends IURLConnector, IReportOptions {
  data?: IOutcomeResult;
  vis?: Visualisation;
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
  statusReport?: IStatusReport;
}

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.statusReport.error || props.statusReport.loading) {
    return false;
  }
  return props.statusReport.getStatusReport.categories.length > 0;
};

const exportReportData = (urlConn: IURLConnector, p: IReportOptions): void => {
  const qp = constructReportQueryParams(p.tags, p.openStart, p.orTags);
  qp.set("start", p.start.toISOString());
  qp.set("end", p.end.toISOString());
  const url = `/settings/data/questionnaire/export/${p.questionnaire}`;
  urlConn.setURL(url, qp);
};

const StatusReportInner = (p: IProp) => {
  const renderVis = (): JSX.Element => {
    if (p.vis === Visualisation.RADAR) {
      return (
        <StatusReportRadar
          statusReport={p.statusReport.getStatusReport}
          questionSet={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    }
    if (p.vis === Visualisation.BAR) {
      return (
        <StatusReportDistribution
          statusReport={p.statusReport.getStatusReport}
          questionnaire={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    }
    return (
      <StatusReportTable
        report={p.statusReport.getStatusReport}
        questionSet={p.data.getOutcomeSet}
        category={p.agg === Aggregation.CATEGORY}
      />
    );
  };

  const exportReport = () => {
    exportReportData(p, p);
  };

  if (
    p.statusReport.getStatusReport &&
    p.statusReport.getStatusReport.beneficiaries.length === 0
  ) {
    return <NoRecordsMessage />;
  }
  return (
    <div>
      <StatusReportDetails
        statusReport={p.statusReport.getStatusReport}
        questionSet={p.data.getOutcomeSet}
      />
      <VizControlPanel
        canCategoryAg={p.isCategoryAgPossible}
        visualisations={allowedVisualisations}
        allowCanvasSnapshot={p.isCanvasSnapshotPossible}
        export={exportReport}
      />
      {renderVis()}
    </div>
  );
};

const storeToProps = (state: IStore, ownProps: IProp) => {
  const canCatAg = isCategoryAggregationAvailable(ownProps);
  const viz = getVisualisation(state.pref, allowedVisualisations);
  return {
    vis: viz,
    agg: getAggregation(state.pref, canCatAg),
    isCategoryAgPossible: canCatAg,
    isCanvasSnapshotPossible: viz === Visualisation.RADAR,
  };
};

// t("report")
const StatusInnerWithSpinner = ApolloLoaderHoC<IProp>(
  "report",
  (p: IProp) => p.statusReport,
  StatusReportInner
);
// t("questionnaire")
const StatusInnerWithSpinners = ApolloLoaderHoC(
  "questionnaire",
  (p: IProp) => p.data,
  StatusInnerWithSpinner
);

const StatusInnerConnected = connect(
  storeToProps,
  UrlConnector
)(StatusInnerWithSpinners);

const StatusInnerWithReport = getStatusReport<IProp>(
  (p) => p.questionnaire,
  (p) => p.start.toISOString(),
  (p) => p.end.toISOString(),
  (p) => p.tags,
  (p) => p.orTags,
  "statusReport"
)(StatusInnerConnected);

const StatusReport = getOutcomeSet<IProp>((p) => p.questionnaire)(
  StatusInnerWithReport
);

export { StatusReport };
