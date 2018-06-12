import * as React from 'react';
import {IAnswerAggregationReport, IExcluded, IExclusion} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';
import {isNullOrUndefined} from 'util';

interface IProp {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
}

function getExclusions(excluded: IExclusion[]): IExcluded {
  return excluded.reduce((agg: IExcluded, e: IExclusion) => {
    const b = !isNullOrUndefined(e.beneficiary);
    const q = !isNullOrUndefined(e.question);
    const c = !isNullOrUndefined(e.category);
    if (b && !q && !c) {
      agg.beneficiaryIDs.push(e.beneficiary);
    }
    if (q && !b && !c) {
      agg.questionIDs.push(e.question);
    }
    if (c && !b && !q) {
      agg.categoryIDs.push(e.category);
    }
    return agg;
  }, {
    categoryIDs: [],
    questionIDs: [],
    beneficiaryIDs: [],
  });
}

class ServiceReportDetails extends React.Component<IProp, any> {

  private getCategoryString(catID: string, qs: IOutcomeSet): string {
    const cat = qs.categories.find((c) => c.id === catID);
    if (cat === undefined) {
      return catID;
    } else {
      return cat.name;
    }
  }

  private getQuestionString(qID: string, qs: IOutcomeSet): string {
    const question = qs.questions.find((q) => q.id === qID);
    if (question === undefined) {
      return qID;
    } else {
      return question.question;
    }
  }

  private getCategoryWarnings(sr: IAnswerAggregationReport, qs: IOutcomeSet): string[] {
    return sr.excluded.filter((e) => !isNullOrUndefined(e.category) && !isNullOrUndefined(e.beneficiary)).map((e) => {
      const catIdentifier = this.getCategoryString(e.category, qs);
      return `Beneficiary '${e.beneficiary}' category '${catIdentifier}': ${e.reason}`;
    });
  }

  private getQuestionWarnings(sr: IAnswerAggregationReport, qs: IOutcomeSet): string[] {
    return sr.excluded.filter((e) => !isNullOrUndefined(e.question) && !isNullOrUndefined(e.beneficiary)).map((e) => {
      const questionIdentifier = this.getQuestionString(e.question, qs);
      return `Beneficiary '${e.beneficiary}' question '${questionIdentifier}': ${e.reason}`;
    });
  }

  private getWarnings(sr: IAnswerAggregationReport, qs: IOutcomeSet): string[] {
    let warns = [];
    warns = warns.concat(this.getQuestionWarnings(sr, qs));
    warns = warns.concat(this.getCategoryWarnings(sr, qs));
    return warns;
  }

  public render() {
    const warnings = this.getWarnings(this.props.serviceReport, this.props.questionSet);
    const includedBens = this.props.serviceReport.beneficiaries.map((b) => b.id);
    return (
      <ReportDetails
        includedBeneficiaries={includedBens}
        excluded={getExclusions(this.props.serviceReport.excluded)}
        warnings={warnings}
        questionSet={this.props.questionSet}
      />
    );
  }
}

export {ServiceReportDetails}
