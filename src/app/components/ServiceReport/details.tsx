import * as React from 'react';
import {IAnswerAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';
import {getExcluded, getWarnings} from '../../helpers/report';

interface IProp {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
}

class ServiceReportDetails extends React.Component<IProp, any> {

  public render() {
    const warnings = getWarnings(this.props.serviceReport.excluded, this.props.questionSet);
    const includedBens = this.props.serviceReport.beneficiaries.map((b) => b.id);
    return (
      <ReportDetails
        introduction="This report shows how much change there has been between each beneficiary's first and last record"
        includedBeneficiaries={includedBens}
        excluded={getExcluded(this.props.serviceReport.excluded)}
        warnings={warnings}
        questionSet={this.props.questionSet}
      />
    );
  }
}

export {ServiceReportDetails};
