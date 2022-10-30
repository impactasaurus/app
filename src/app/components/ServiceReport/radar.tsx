import * as React from "react";
import { IAnswerAggregationReport, IAnswerDistance } from "models/report";
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
import { useTranslation } from "react-i18next";

interface IProp {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}

function getRadarSeries(
  t: (text: string) => string,
  aa: IAnswerDistance[],
  labeller: (IAnswerAggregation) => string,
  indexer: (IAnswerAggregation) => number
): IRadarSeries[] {
  const pre = aa.reduce(
    (pre, a) => {
      const label = labeller(a);
      const idx = indexer(a);
      pre.initial.push({
        axis: label,
        axisIndex: idx,
        value: a.initial,
      });
      pre.latest.push({
        axis: label,
        axisIndex: idx,
        value: a.latest,
      });
      return pre;
    },
    {
      initial: [] as IRadarPoint[],
      latest: [] as IRadarPoint[],
    }
  );
  return [
    {
      name: t("Initial"),
      datapoints: pre.initial,
    },
    {
      name: t("Latest"),
      datapoints: pre.latest,
    },
  ];
}

function getCategoryRadarData(
  t: (text: string) => string,
  p: IProp
): RadarData {
  const getCatLabel = (aa: IAnswerDistance): string => {
    return getCategoryFriendlyName(aa.id, p.questionSet);
  };
  const getCatIdx = (aa: IAnswerDistance): number => {
    return p.questionSet.categories.findIndex((c) => c.id === aa.id);
  };
  return {
    series: getRadarSeries(
      t,
      p.serviceReport.categories,
      getCatLabel,
      getCatIdx
    ),
    scaleMin: getMinCategoryValue(p.questionSet),
    scaleMax: getMaxCategoryValue(p.questionSet),
  };
}

function getQuestionRadarData(
  t: (text: string) => string,
  p: IProp
): RadarData {
  const getQLabel = (aa: IAnswerDistance): string => {
    return getQuestionFriendlyName(aa.id, p.questionSet);
  };
  const getQIdx = (aa: IAnswerDistance): number => {
    return p.questionSet.questions.findIndex((q) => q.id === aa.id);
  };
  return {
    series: getRadarSeries(t, p.serviceReport.questions, getQLabel, getQIdx),
    scaleMin: getMinQuestionValue(p.questionSet),
    scaleMax: getMaxQuestionValue(p.questionSet),
  };
}

function getRadarData(t: (text: string) => string, p: IProp): RadarData {
  if (p.category) {
    return getCategoryRadarData(t, p);
  }
  return getQuestionRadarData(t, p);
}

function renderRadar(t: (text: string) => string, p: IProp): JSX.Element {
  if (p.serviceReport.beneficiaries.length === 0) {
    return <div />;
  }
  const data = getRadarData(t, p);
  const agg = p.category ? Aggregation.CATEGORY : Aggregation.QUESTION;
  return (
    <RadarChart
      data={data}
      aggregation={agg}
      onError={p.onError}
      onSuccess={p.onSuccess}
    />
  );
}

export const ServiceReportRadar = (p: IProp): JSX.Element => {
  const { t } = useTranslation();
  return <div className="service-report-radar">{renderRadar(t, p)}</div>;
};
