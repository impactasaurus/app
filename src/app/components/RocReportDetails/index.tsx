import * as React from 'react';
import {IROCReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';

interface IProp {
  report: IROCReport;
  questionSet: IOutcomeSet;
}

class RocReportDetails extends React.Component<IProp, any> {

  public render() {
    const benIDs = this.props.report.beneficiaries.map((b) => b.beneficiary);
    return (
      <ReportDetails
        includedBeneficiaries={benIDs}
        excluded={this.props.report.excluded}
        warnings={this.props.report.warnings}
        questionSet={this.props.questionSet}
        excludedReason={'they only have a single assessment within the selected report range'}
      />
    );
  }
}

export {RocReportDetails}
