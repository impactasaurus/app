import React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import { ReportDetails } from "components/ReportDetails";
import { getExcluded, getWarnings } from "../../helpers/report";
import { ISnapshotReport } from ".";

interface IProps {
  snapshotReport: ISnapshotReport;
  questionSet: IOutcomeSet;
  introText: string;
}

export const StatusReportDetails = (p: IProps): JSX.Element => {
  const { snapshotReport: statusReport, questionSet } = p;
  const warnings = getWarnings(statusReport.excluded, questionSet);
  const includedBens = statusReport.beneficiaries.map((b) => b.id);
  const exclusions = getExcluded(statusReport.excluded);
  exclusions.beneficiaryIDs = [];
  return (
    <ReportDetails
      introduction={p.introText}
      includedBeneficiaries={includedBens}
      excluded={exclusions}
      warnings={warnings}
      questionSet={questionSet}
    />
  );
};
