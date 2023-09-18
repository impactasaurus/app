import * as React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import {
  AnswerDistributionChart,
  IAnswerDistribution,
  IAnswerDistributionSeries,
} from "components/AnswerDistributionChart";
import {
  getCategoryFriendlyName,
  getCategoryMaxValue,
  getCategoryMinValue,
  getQuestionFriendlyName,
  getQuestionMaxValue,
  getQuestionMinValue,
  getQuestions,
} from "helpers/questionnaire";
import { Question } from "models/question";
import { IAggregation, IBenAggregation, ISnapshotReport } from ".";

interface IProps {
  snapshotReport: ISnapshotReport;
  questionnaire: IOutcomeSet;
  category: boolean;
  seriesLabel: string;
}

export const StatusReportDistribution = (p: IProps): JSX.Element => {
  const answerDistributions = (id: string): number[] => {
    return p.snapshotReport.beneficiaries.reduce(
      (values: number[], ben: IBenAggregation): number[] => {
        const answers = p.category ? ben.categories : ben.questions;
        const answer = answers.find((a: IAggregation) => a.id === id);
        if (answer === undefined) {
          return values;
        }
        return values.concat(answer.value);
      },
      []
    );
  };

  const populateAnswerDistribution = (
    id: string
  ): IAnswerDistributionSeries[] => {
    return [
      {
        name: p.seriesLabel,
        values: answerDistributions(id),
      },
    ];
  };

  const getDataSet = (): IAnswerDistribution[] => {
    if (p.category) {
      return p.questionnaire.categories
        .map((c) => {
          return {
            id: c.id,
            name: getCategoryFriendlyName(c.id, p.questionnaire),
            min: getCategoryMinValue(p.questionnaire, c.id),
            max: getCategoryMaxValue(p.questionnaire, c.id),
            series: populateAnswerDistribution(c.id),
          };
        })
        .filter((c) => c.min && c.max);
    }
    return getQuestions(p.questionnaire).map((q) => {
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
