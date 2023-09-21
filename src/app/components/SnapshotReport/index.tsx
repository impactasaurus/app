import React from "react";
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
import { NoRecordsMessage } from "containers/Report/helpers";
import { connect } from "react-redux";
import { StatusReportDistribution } from "./distribution";
import { IExclusion, IID } from "models/report";
import { IOutcomeSet } from "models/outcomeSet";

const allowedVisualisations = [
  Visualisation.RADAR,
  Visualisation.BAR,
  Visualisation.TABLE,
];

export interface IBenAggregation extends IID {
  questions: IAggregation[];
  categories: IAggregation[];
}

export interface IAggregation extends IID {
  value: number;
}

export interface ISnapshotReport {
  beneficiaries: IBenAggregation[];
  questions: IAggregation[];
  categories: IAggregation[];
  excluded: IExclusion[];
}

export interface IExternalProps {
  introText: string;
  seriesLabel: string;
  questionnaire: IOutcomeSet;
  snapshot: ISnapshotReport;
}

export interface IProp extends IExternalProps {
  vis?: Visualisation;
  agg?: Aggregation;
  isCategoryAgPossible?: boolean;
  isCanvasSnapshotPossible?: boolean;
  baseline?: boolean; // undefined = false
  exportData: () => void;
}

const isCategoryAggregationAvailable = (p: IProp): boolean => {
  return p.snapshot.categories.length > 0;
};

const SnapshotReportInner = (p: IProp) => {
  const renderVis = (): JSX.Element => {
    if (p.vis === Visualisation.RADAR) {
      return (
        <StatusReportRadar
          snapshotReport={p.snapshot}
          questionSet={p.questionnaire}
          category={p.agg === Aggregation.CATEGORY}
          seriesLabel={p.seriesLabel}
        />
      );
    }
    if (p.vis === Visualisation.BAR) {
      return (
        <StatusReportDistribution
          snapshotReport={p.snapshot}
          questionnaire={p.questionnaire}
          category={p.agg === Aggregation.CATEGORY}
          seriesLabel={p.seriesLabel}
        />
      );
    }
    return (
      <StatusReportTable
        report={p.snapshot}
        questionSet={p.questionnaire}
        category={p.agg === Aggregation.CATEGORY}
        seriesLabel={p.seriesLabel}
      />
    );
  };

  const exportReport = () => {
    p.exportData();
  };

  if (p.snapshot && p.snapshot.beneficiaries.length === 0) {
    return <NoRecordsMessage />;
  }
  return (
    <div>
      <StatusReportDetails
        snapshotReport={p.snapshot}
        questionSet={p.questionnaire}
        introText={p.introText}
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

const SnapshotReport =
  connect<IExternalProps>(storeToProps)(SnapshotReportInner);

export { SnapshotReport };
