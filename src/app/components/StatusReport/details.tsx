import React from "react";
import { ILatestAggregationReport } from "models/report";
import { IOutcomeSet } from "models/outcomeSet";
import { ReportDetails } from "components/ReportDetails";
import { getExcluded, getWarnings } from "../../helpers/report";
import { useTranslation } from "react-i18next";

interface IProps {
  statusReport: ILatestAggregationReport;
  questionSet: IOutcomeSet;
}

export const StatusReportDetails = (p: IProps): JSX.Element => {
  const { statusReport, questionSet } = p;
  const warnings = getWarnings(statusReport.excluded, questionSet);
  const includedBens = statusReport.beneficiaries.map((b) => b.id);
  const exclusions = getExcluded(statusReport.excluded);
  exclusions.beneficiaryIDs = [];
  const { t } = useTranslation();
  return (
    <ReportDetails
      introduction={t(
        "This report shows the most recent response from each beneficiary"
      )}
      includedBeneficiaries={includedBens}
      excluded={exclusions}
      warnings={warnings}
      questionSet={questionSet}
    />
  );
};
