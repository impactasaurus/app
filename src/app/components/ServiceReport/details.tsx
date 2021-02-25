import * as React from 'react';
import {IAnswerAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';
import {getExcluded, getWarnings} from '../../helpers/report';
import {useTranslation} from 'react-i18next';

interface IProps {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
}

export const ServiceReportDetails = (p: IProps): JSX.Element => {
  const {serviceReport, questionSet} = p;
  const warnings = getWarnings(serviceReport.excluded, questionSet);
  const includedBens = serviceReport.beneficiaries.map((b) => b.id);
  const { t } = useTranslation();
  return (
    <ReportDetails
      introduction={t("This report shows how much change there has been between each beneficiary's first and last record")}
      includedBeneficiaries={includedBens}
      excluded={getExcluded(serviceReport.excluded)}
      warnings={warnings}
      questionSet={questionSet}
    />
  );
}
