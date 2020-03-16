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
      description="Reports are used to demonstrate your impact. A beneficiary must have at least two records to be included in a report. Create another record for the same beneficiary and then try generating a report."
      completed={completed}
      loading={loading}
      link="/report"
      index={p.index}
    />
  );
};

export const ReportChecklistItem = hasOrgGeneratedReport<IProps>(Inner);
