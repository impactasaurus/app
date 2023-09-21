import * as React from "react";
import { IOutcomeSet } from "models/outcomeSet";
import { ReportDetails } from "components/ReportDetails";
import { getExcluded, getWarnings } from "../../helpers/report";
import { useTranslation } from "react-i18next";
import { IReport } from "models/report";

interface IProps {
  report: IReport;
  questionSet: IOutcomeSet;
}

export const ServiceReportDetails = (p: IProps): JSX.Element => {
  const { t } = useTranslation();

  const { report, questionSet } = p;
  const warnings = getWarnings(report.excluded, questionSet);
  const includedBens = report.beneficiaries.map((b) => b.id);
  return (
    <ReportDetails
      introduction={t(
        "This report shows how much change there has been between each beneficiary's first and last record"
      )}
      includedBeneficiaries={includedBens}
      excluded={getExcluded(report.excluded)}
      warnings={warnings}
      questionSet={questionSet}
    />
  );
};
