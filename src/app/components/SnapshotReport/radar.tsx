import * as React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import { RadarChart } from "components/RadarChart";
import { RadarData, IRadarSeries, IRadarPoint } from "models/radar";
import { Aggregation } from "models/pref";
import {
  getMinQuestionValue,
  getMaxQuestionValue,
  getMinCategoryValue,
  getMaxCategoryValue,
  getQuestionFriendlyName,
  getCategoryFriendlyName,
} from "helpers/questionnaire";
import { IAggregation, ISnapshotReport } from ".";

interface IProp {
  snapshotReport: ISnapshotReport;
  questionSet: IOutcomeSet;
  category?: boolean;
  seriesLabel: string;
}

function getRadarSeries(
  seriesLabel: string,
  aa: IAggregation[],
  labeller: (IAggregation) => string,
  indexer: (IAggregation) => number
): IRadarSeries[] {
  const pre = aa.reduce(
    (pre, a) => {
      const label = labeller(a);
      const idx = indexer(a);
      pre.values.push({
        axis: label,
        axisIndex: idx,
        value: a.value,
      });
      return pre;
    },
    {
      values: [] as IRadarPoint[],
    }
  );
  return [
    {
      name: seriesLabel,
      datapoints: pre.values,
    },
  ];
}

function getCategoryRadarData(p: IProp): RadarData {
  const getCatLabel = (aa: IAggregation): string => {
    return getCategoryFriendlyName(aa.id, p.questionSet);
  };
  const getCatIdx = (aa: IAggregation): number => {
    return p.questionSet.categories.findIndex((c) => c.id === aa.id);
  };
  return {
    series: getRadarSeries(
      p.seriesLabel,
      p.snapshotReport.categories,
      getCatLabel,
      getCatIdx
    ),
    scaleMin: getMinCategoryValue(p.questionSet),
    scaleMax: getMaxCategoryValue(p.questionSet),
  };
}

function getQuestionRadarData(p: IProp): RadarData {
  const getQLabel = (aa: IAggregation): string => {
    return getQuestionFriendlyName(aa.id, p.questionSet);
  };
  const getQIdx = (aa: IAggregation): number => {
    return p.questionSet.questions.findIndex((q) => q.id === aa.id);
  };
  return {
    series: getRadarSeries(
      p.seriesLabel,
      p.snapshotReport.questions,
      getQLabel,
      getQIdx
    ),
    scaleMin: getMinQuestionValue(p.questionSet),
    scaleMax: getMaxQuestionValue(p.questionSet),
  };
}

function getRadarData(p: IProp): RadarData {
  if (p.category) {
    return getCategoryRadarData(p);
  }
  return getQuestionRadarData(p);
}

function renderRadar(p: IProp): JSX.Element {
  if (p.snapshotReport.beneficiaries.length === 0) {
    return <div />;
  }
  const data = getRadarData(p);
  const agg = p.category ? Aggregation.CATEGORY : Aggregation.QUESTION;
  return <RadarChart data={data} aggregation={agg} />;
}

export const StatusReportRadar = (p: IProp): JSX.Element => {
  return <div className="status-report-radar">{renderRadar(p)}</div>;
};
