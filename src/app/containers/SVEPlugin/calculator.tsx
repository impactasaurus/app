import React, { useState } from "react";
import { IFormOutput as ReportForm } from "components/ReportForm";
import { Button } from "semantic-ui-react";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getJOCServiceReport, IJOCReportResult } from "apollo/modules/reports";
import { QuestionSelect } from "components/QuestionSelect";

export interface IDeflators {
  deadweight?: number;
  attribution?: number;
  dropOff?: number;
}

interface IProps extends IJOCReportResult {
  data?: IOutcomeResult;

  config: ReportForm;
  onFormSubmit(v: IDeflators): void;
  back(): void;
}

const SVECalculatorInner = (p: IProps): JSX.Element => {
  const [dropOffQ, setDropOffQ] = useState<string>();
  const [attributionQ, setAttributionQ] = useState<string>();
  const [deadWeightQ, setDeadWeightQ] = useState<string>();
  const dummy = () => {
    p.onFormSubmit({ dropOff: 0.3 });
  };
  return (
    <>
      <QuestionSelect
        questionnaireID={p.data.getOutcomeSet.id}
        onChange={setDropOffQ}
        questionID={dropOffQ}
      />
      <QuestionSelect
        questionnaireID={p.data.getOutcomeSet.id}
        onChange={setAttributionQ}
        questionID={attributionQ}
      />
      <QuestionSelect
        questionnaireID={p.data.getOutcomeSet.id}
        onChange={setDeadWeightQ}
        questionID={deadWeightQ}
      />
      <Button onClick={dummy}>Submit</Button>
    </>
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
