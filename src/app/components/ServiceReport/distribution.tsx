import * as React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import {
  IAnswerAggregationReport,
  IAnswerTimestampedDistance,
  IBenDistance,
} from "models/report";
import {
  AnswerDistribution,
  IAnswerDistribution,
  IAnswerDistributionSeries,
} from "components/AnswerDistribution";
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
  serviceReport: IAnswerAggregationReport;
  questionnaire: IOutcomeSet;
  category: boolean;
}

export const ServiceReportDistribution = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const answerDistributions = (
    id: string,
    valueExtractor: (a: IAnswerTimestampedDistance) => number
  ): number[] => {
    return p.serviceReport.beneficiaries.reduce(
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
        name: t("Initial"),
        values: answerDistributions(
          id,
          (a: IAnswerTimestampedDistance) => a.initial.value
        ),
      },
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

  return (
    <AnswerDistribution
      selectLabel={p.category ? t("Category") : t("Question")}
      data={getDataSet()}
    />
  );
};
