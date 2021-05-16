import { IBeneficiaryDeltaReport } from "models/report";
import { IOutcomeSet } from "models/outcomeSet";
import { getExcluded, getWarnings } from "helpers/report";
import { ReportDetails } from "components/ReportDetails";
import { useTranslation } from "react-i18next";
import * as React from "react";

interface IProps {
  report: IBeneficiaryDeltaReport;
  questionnaire: IOutcomeSet;
}

export const DeltaReportDetails = (p: IProps): JSX.Element => {
  const { report, questionnaire } = p;
  const warnings = getWarnings(report.excluded, questionnaire);
  const bens = report.beneficiaries.map((b) => b.id);
  const { t } = useTranslation();
  return (
    <ReportDetails
      introduction={t(
        "This report shows whether the answers provided by your beneficiaries changed between their first and last records"
      )}
      includedBeneficiaries={bens}
      excluded={getExcluded(report.excluded)}
      warnings={warnings}
      questionSet={questionnaire}
    />
  );
};
