import * as React from "react";
import { getJOCServiceReport, IJOCReportResult } from "apollo/modules/reports";
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
} from "containers/Report/helpers";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { connect } from "react-redux";

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

const ServiceReportInner = (p: IProp) => {
  const renderVis = (): JSX.Element => {
    if (p.vis === Visualisation.RADAR) {
      return (
        <ServiceReportRadar
          serviceReport={p.JOCServiceReport.getJOCServiceReport}
          questionSet={p.data.getOutcomeSet}
          category={p.agg === Aggregation.CATEGORY}
        />
      );
    }
    return (
      <ServiceReportTable
        serviceReport={p.JOCServiceReport.getJOCServiceReport}
        questionSet={p.data.getOutcomeSet}
        category={p.agg === Aggregation.CATEGORY}
      />
    );
  };

  const exportReport = () => {
    exportReportData(p, p);
  };

  if (
    p.JOCServiceReport.getJOCServiceReport &&
    p.JOCServiceReport.getJOCServiceReport.beneficiaries.length === 0
  ) {
    return (
      <EmptyReportMessage
        ie={p.JOCServiceReport.getJOCServiceReport.excluded}
      />
    );
  }
  return (
    <div>
      <ServiceReportDetails
        serviceReport={p.JOCServiceReport.getJOCServiceReport}
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
  (p: IProp) => p.JOCServiceReport,
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

const ServiceInnerWithReport = getJOCServiceReport<IProp>(
  (p) => p.questionnaire,
  (p) => p.start.toISOString(),
  (p) => p.end.toISOString(),
  (p) => p.tags,
  (p) => p.openStart,
  (p) => p.orTags
)(ServiceInnerConnected);

const ServiceReport = getOutcomeSet<IProp>((p) => p.questionnaire)(
  ServiceInnerWithReport
);

export { ServiceReport };
