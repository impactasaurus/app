import * as React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import {
  IAnswerTimestampedDistance,
  IBenDistance,
  ILatestAggregationReport,
} from "models/report";
import {
  AnswerDistributionChart,
  IAnswerDistribution,
  IAnswerDistributionSeries,
} from "components/AnswerDistributionChart";
import { useTranslation } from "react-i18next";
import {
  getCategoryFriendlyName,
  getCategoryMaxValue,
  getCategoryMinValue,
  getQuestionFriendlyName,
  getQuestionMaxValue,
  getQuestionMinValue,
} from "helpers/questionnaire";
import { Question } from "models/question";

interface IProps {
  statusReport: ILatestAggregationReport;
  questionnaire: IOutcomeSet;
  category: boolean;
}

export const StatusReportDistribution = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const answerDistributions = (
    id: string,
    valueExtractor: (a: IAnswerTimestampedDistance) => number
  ): number[] => {
    return p.statusReport.beneficiaries.reduce(
      (values: number[], ben: IBenDistance): number[] => {
        const answers = p.category ? ben.categories : ben.questions;
        const answer = answers.find(
          (a: IAnswerTimestampedDistance) => a.aID === id
        );
        if (answer === undefined) {
          return values;
        }
        return values.concat(valueExtractor(answer));
      },
      []
    );
  };

  const populateAnswerDistribution = (
    id: string
  ): IAnswerDistributionSeries[] => {
    return [
      {
        name: t("Latest"),
        values: answerDistributions(
          id,
          (a: IAnswerTimestampedDistance) => a.latest.value
        ),
      },
    ];
  };

  const getDataSet = (): IAnswerDistribution[] => {
    if (p.category) {
      return p.questionnaire.categories.map((c) => {
        return {
          id: c.id,
          name: getCategoryFriendlyName(c.id, p.questionnaire),
          min: getCategoryMinValue(p.questionnaire, c.id),
          max: getCategoryMaxValue(p.questionnaire, c.id),
          series: populateAnswerDistribution(c.id),
        };
      });
    }
    return p.questionnaire.questions.map((q) => {
      return {
        id: q.id,
        name: getQuestionFriendlyName(q.id, p.questionnaire),
        min: getQuestionMinValue(q as Question),
        max: getQuestionMaxValue(q as Question),
        series: populateAnswerDistribution(q.id),
      };
    });
  };

  return <AnswerDistributionChart data={getDataSet()} />;
};
