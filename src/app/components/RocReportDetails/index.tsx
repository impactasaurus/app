import * as React from 'react';
import {IBeneficiaryAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';
import {getExcluded, getWarnings} from 'helpers/report';

interface IProp {
  report: IBeneficiaryAggregationReport;
  questionSet: IOutcomeSet;
}

class RocReportDetails extends React.Component<IProp, any> {

  public render() {
    const benIDs = this.props.report.beneficiaries.map((b) => b.id);
    return (
      <ReportDetails
        includedBeneficiaries={benIDs}
        excluded={getExcluded(this.props.report.excluded)}
        warnings={getWarnings(this.props.report.excluded, this.props.questionSet)}
        questionSet={this.props.questionSet}
        excludedReason={'they do not have records covering enough of the report date range'}
      />
    );
  }
}

export {RocReportDetails};
