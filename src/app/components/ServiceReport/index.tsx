import * as React from "react";
import { getReport, IReportResponse } from "apollo/modules/reports";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { ServiceReportDetails } from "./details";
import { ServiceReportRadar } from "./radar";
import { ServiceReportTable } from "./table";
import { VizControlPanel } from "components/VizControlPanel";
import { IStore } from "redux/IStore";
import {
  Aggregation,
  Visualisation,
  getAggregation,
  getVisualisation,
} from "models/pref";
import { IURLConnector, UrlConnector } from "redux/modules/url";
import {
  exportReportData,
  IReportOptions,
  EmptyReportMessage,
  IUserReportOptions,
} from "containers/Report/helpers";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { connect } from "react-redux";

const allowedVisualisations = [Visualisation.RADAR, Visualisation.TABLE];

interface IProp extends IUserReportOptions, IURLConnector, IReportOptions {
  data?: IOutcomeResult;
  report: IReportResponse;
  vis?: Visualisation;
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
}

const reportOpts = (
  p: IUserReportOptions,
  minRecords?: number
): IReportOptions => ({
  minRecords: minRecords ?? 2,
  ...p,
});

const isCategoryAggregationAvailable = (props: IProp): boolean => {
  if (props.report.error || props.report.loading) {
    return false;
  }
  return props.report.getReport.categories.length > 0;
};

const ServiceReportInner = (p: IProp) => {
  const renderVis = (): JSX.Element => {
    if (p.vis === Visualisation.RADAR) {
      return (
        <ServiceReportRadar
          report={p.report.getReport}
          questionSet={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    }
    return (
      <ServiceReportTable
        report={p.report.getReport}
        questionSet={p.data.getOutcomeSet}
        category={p.agg === Aggregation.CATEGORY}
      />
    );
  };

  const exportReport = () => {
    exportReportData(p.setURL, reportOpts(p));
  };

  if (p.report.getReport && p.report.getReport.beneficiaries.length === 0) {
    return <EmptyReportMessage ie={p.report.getReport.excluded} />;
  }
  return (
    <div>
      <ServiceReportDetails
        report={p.report.getReport}
        questionSet={p.data.getOutcomeSet}
      />
      <VizControlPanel
        canCategoryAg={p.isCategoryAgPossible}
        visualisations={allowedVisualisations}
        export={exportReport}
        allowCanvasSnapshot={p.isCanvasSnapshotPossible}
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
const ServiceInnerWithSpinner = ApolloLoaderHoC<IProp>(
  "report",
  (p: IProp) => p.report,
  ServiceReportInner
);
// t("questionnaire")
const ServiceInnerWithSpinners = ApolloLoaderHoC(
  "questionnaire",
  (p: IProp) => p.data,
  ServiceInnerWithSpinner
);

const ServiceInnerConnected = connect(
  storeToProps,
  UrlConnector
)(ServiceInnerWithSpinners);

const ServiceInnerWithQuestionnaire = getOutcomeSet<IProp>(
  (p) => p.questionnaire
)(ServiceInnerConnected);

export const ServiceReport = getReport<IUserReportOptions>(
  (p) => reportOpts(p),
  "report"
)(ServiceInnerWithQuestionnaire);

export const DilutedServiceReport = getReport<IUserReportOptions>(
  (p) => reportOpts(p, 1),
  "report"
)(ServiceInnerWithQuestionnaire);
