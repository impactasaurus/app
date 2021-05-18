import React from "react";
import { IFormOutput as ReportForm } from "components/ReportForm";
import { Button } from "semantic-ui-react";
import { ApolloLoaderHoC } from "components/ApolloLoaderHoC";
import { getOutcomeSet, IOutcomeResult } from "apollo/modules/outcomeSets";
import { getJOCServiceReport, IJOCReportResult } from "apollo/modules/reports";

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
  const dummy = () => {
    p.onFormSubmit({ dropOff: 0.3 });
  };
  return <Button onClick={dummy}>Submit</Button>;
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
