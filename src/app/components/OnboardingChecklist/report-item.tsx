import * as React from 'react';
import {OnboardingChecklistItem} from './item';
import {hasOrgGeneratedReport, IHasOrgGeneratedReport} from 'apollo/modules/organisation';

interface IProps {
  data?: IHasOrgGeneratedReport;
  index: number;
}

const Inner = (p: IProps) => {
  const loading = p.data.loading;
  const completed = !loading && p.data.reportGenerated;
  return (
    <OnboardingChecklistItem
      title="Generate a report"
      description="To determine your impact, beneficiaries must have at least two records. Once you have created at least two records for a beneficiary, generate a report."
      completed={completed}
      loading={loading}
      link="/report"
      index={p.index}
    />
  );
};

export const ReportChecklistItem = hasOrgGeneratedReport<IProps>(Inner);
