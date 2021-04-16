import * as React from 'react';
import {IAnswerAggregation, ILatestAggregation, ILatestAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {RadarChart} from 'components/RadarChart';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Aggregation} from 'models/pref';
import {
  getMinQuestionValue, getMaxQuestionValue, getMinCategoryValue, getMaxCategoryValue,
  getQuestionFriendlyName, getCategoryFriendlyName,
} from 'helpers/questionnaire';
import { useTranslation } from 'react-i18next';

interface IProp {
  statusReport: ILatestAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

function getRadarSeries(t: (text: string) => string, aa: ILatestAggregation[], labeller: (IAnswerAggregation) => string, indexer: (IAnswerAggregation) => number): IRadarSeries[] {
  const pre = aa.reduce((pre, a) => {
    const label = labeller(a);
    const idx = indexer(a);
    pre.latest.push({
      axis: label,
      axisIndex: idx,
      value: a.latest,
    });
    return pre;
  }, {
    latest: [] as IRadarPoint[],
  });
  return [{
    name: t('Latest'),
    datapoints: pre.latest,
  }];
}

function getCategoryRadarData(t: (text: string) => string, p: IProp): RadarData {
  const getCatLabel = (aa: IAnswerAggregation): string => {
    return getCategoryFriendlyName(aa.id, p.questionSet);
  };
  const getCatIdx = (aa: IAnswerAggregation): number => {
    return p.questionSet.categories.findIndex((c) => c.id === aa.id);
  };
  return {
    series: getRadarSeries(t, p.statusReport.categories, getCatLabel, getCatIdx),
    scaleMin: getMinCategoryValue(p.questionSet),
    scaleMax: getMaxCategoryValue(p.questionSet),
  };
}

function getQuestionRadarData(t: (text: string) => string, p: IProp): RadarData {
  const getQLabel = (aa: IAnswerAggregation): string => {
    return getQuestionFriendlyName(aa.id, p.questionSet);
  };
  const getQIdx = (aa: IAnswerAggregation): number => {
    return p.questionSet.questions.findIndex((q) => q.id === aa.id);
  };
  return {
    series: getRadarSeries(t, p.statusReport.questions, getQLabel, getQIdx),
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
  if (p.statusReport.beneficiaries.length === 0) {
    return (<div />);
  }
  const data = getRadarData(t, p);
  const agg = p.category ? Aggregation.CATEGORY : Aggregation.QUESTION;
  return (
    <RadarChart data={data} aggregation={agg}/>
  );
}

export const StatusReportRadar = (p: IProp): JSX.Element => {
  const {t} = useTranslation();
  return (
    <div className="status-report-radar">
      {renderRadar(t, p)}
    </div>
  );
}
