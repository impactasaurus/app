/* eslint-disable i18next/no-literal-string */
import React, { useEffect, useState } from "react";
import { IFormOutput as ReportForm } from "components/ReportForm";
import { Form } from "semantic-ui-react";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getJOCServiceReport, IJOCReportResult } from "apollo/modules/reports";
import { QuestionSelect } from "components/QuestionSelect";
import { useTranslation } from "react-i18next";
import { FormField } from "components/FormField";
import { IAnswerAggregation, IAnswerAggregationReport } from "models/report";
import { convertQuestionValueToPercentage } from "helpers/questionnaire";
import { IOutcomeSet } from "models/outcomeSet";

export interface IDeflators {
  deadWeight?: number;
  attribution?: number;
  dropOff?: number;
}

interface IProps extends IJOCReportResult {
  data?: IOutcomeResult;

  config: ReportForm;
  onFormSubmit(v: IDeflators): void;
  back(): void;
}

const extractFraction = (
  qID: string | undefined,
  extractor: (aa: IAnswerAggregation) => number,
  report: IAnswerAggregationReport,
  questionnaire: IOutcomeSet
): number | undefined => {
  if (!qID) {
    return undefined;
  }
  const qData = report.questions.find((aa) => aa.id == qID);
  if (!qData) {
    return undefined;
  }
  const per = convertQuestionValueToPercentage(
    questionnaire,
    qID,
    extractor(qData)
  );
  if (!per) {
    return undefined;
  }
  return per / 100.0;
};

// people’s reported experience of the likelihood of them achieving an outcome without intervention.
// take the first response as this represents the likelihood of them achieving the outcome without support.
const calcDeadWeight = (
  qID: string | undefined,
  report: IAnswerAggregationReport,
  questionnaire: IOutcomeSet
): number | undefined =>
  extractFraction(qID, (aa) => aa.initial, report, questionnaire);

// over the next year how much will the impact diminish.
// doesn't really need to be longitudinal, take the most recent response.
const calcDropOff = (
  qID: string | undefined,
  report: IAnswerAggregationReport,
  questionnaire: IOutcomeSet
): number | undefined =>
  extractFraction(qID, (aa) => aa.latest, report, questionnaire);

// how much impact was attributed to the intervention.
// doesn't really need to be longitudinal, take the most recent response.
const calcAttribution = (
  qID: string | undefined,
  report: IAnswerAggregationReport,
  questionnaire: IOutcomeSet
): number | undefined =>
  extractFraction(qID, (aa) => aa.latest, report, questionnaire);

const SVECalculatorInner = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const [dropOffQ, setDropOffQ] = useState<string>();
  const [attributionQ, setAttributionQ] = useState<string>();
  const [deadWeightQ, setDeadWeightQ] = useState<string>();
  const [deflators, setDeflators] = useState<IDeflators>();

  useEffect(() => {
    setDeflators({
      attribution: calcAttribution(
        attributionQ,
        p.JOCServiceReport.getJOCServiceReport,
        p.data.getOutcomeSet
      ),
      deadWeight: calcDeadWeight(
        deadWeightQ,
        p.JOCServiceReport.getJOCServiceReport,
        p.data.getOutcomeSet
      ),
      dropOff: calcDropOff(
        dropOffQ,
        p.JOCServiceReport.getJOCServiceReport,
        p.data.getOutcomeSet
      ),
    });
  }, [dropOffQ, attributionQ, deadWeightQ]);

  const submit = () => {
    p.onFormSubmit(deflators);
  };

  return (
    <Form className="screen" onSubmit={submit} id="sve-calculator-form">
      <FormField inputID="calc-dropoff" label="Drop off">
        <QuestionSelect
          questionnaireID={p.data.getOutcomeSet.id}
          onChange={setDropOffQ}
          questionID={dropOffQ}
          inputID="calc-dropoff"
        />
      </FormField>
      <FormField inputID="calc-attribution" label="Attribution">
        <QuestionSelect
          questionnaireID={p.data.getOutcomeSet.id}
          onChange={setAttributionQ}
          questionID={attributionQ}
          inputID="calc-attribution"
        />
      </FormField>
      <FormField inputID="calc-deadweight" label="Dead weight">
        <QuestionSelect
          questionnaireID={p.data.getOutcomeSet.id}
          onChange={setDeadWeightQ}
          questionID={deadWeightQ}
          inputID="calc-deadweight"
        />
      </FormField>
      <Form.Group>
        <Form.Button type="submit" primary={true}>
          {t("Submit")}
        </Form.Button>
      </Form.Group>
    </Form>
  );
};

// t("data")
const SVEWithSpinner = ApolloLoaderHoC<IProps>(
  "data",
  (p: IProps) => p.JOCServiceReport,
  SVECalculatorInner
);

// t("questionnaire")
const SVEWithSpinners = ApolloLoaderHoC<IProps>(
  "questionnaire",
  (p: IProps) => p.data,
  SVEWithSpinner
);

const SVEWithReport = getJOCServiceReport<IProps>(
  (p) => p.config.questionSetID,
  (p) => p.config?.start?.toISOString() ?? new Date(0).toISOString(),
  (p) => p.config?.end?.toISOString() ?? new Date().toISOString(),
  (p) => p.config.tags,
  () => false,
  (p) => p.config.orTags
)(SVEWithSpinners);

const SVEWithQuestionnaire = getOutcomeSet<IProps>(
  (p: IProps) => p.config.questionSetID
)(SVEWithReport);

export const SVECalculator = SVEWithQuestionnaire;
