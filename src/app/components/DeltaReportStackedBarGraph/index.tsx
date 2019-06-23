import * as React from 'react';
import {IBeneficiaryDeltaReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
interface IProp {
  report: IBeneficiaryDeltaReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

class DeltaReportStackedBarGraph extends React.Component<IProp, any> {
  public render() {
    return (
      <div className="delta-report-stacked-bar-graph">
        HI
      </div>
    );
  }
}

export {DeltaReportStackedBarGraph};
