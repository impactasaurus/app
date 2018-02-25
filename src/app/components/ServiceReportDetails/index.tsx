import * as React from 'react';
import {IJOCServiceReport, IQuestionAggregates, ICategoryAggregates} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ReportDetails} from 'components/ReportDetails';

interface IProp {
  serviceReport: IJOCServiceReport;
  questionSet: IOutcomeSet;
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

  private getCategoryWarnings(sr: IJOCServiceReport, qs: IOutcomeSet): string[] {
    const getAllCatWarningsPrefixedWithCatName = (warns: string[], v: ICategoryAggregates): string[] => {
      if (Array.isArray(v.warnings) && v.warnings.length > 0) {
        const catIdentifier = this.getCategoryString(v.categoryID, qs);
        const newWarns = v.warnings.map((w) => `${catIdentifier}: ${w}`);
        return warns.concat(newWarns);
      }
      return warns;
    };
    let warnings = [];
    warnings = sr.categoryAggregates.first.reduce<string[]>(getAllCatWarningsPrefixedWithCatName, warnings);
    warnings = sr.categoryAggregates.last.reduce<string[]>(getAllCatWarningsPrefixedWithCatName, warnings);
    warnings = sr.categoryAggregates.delta.reduce<string[]>(getAllCatWarningsPrefixedWithCatName, warnings);
    warnings = warnings.filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });
    return warnings;
  }

  private getQuestionWarnings(sr: IJOCServiceReport, qs: IOutcomeSet): string[] {
    const getAllQWarningsPrefixedWithQ = (warns: string[], v: IQuestionAggregates): string[] => {
      if (Array.isArray(v.warnings) && v.warnings.length > 0) {
        const questionIdentifier = this.getQuestionString(v.questionID, qs);
        const newWarns = v.warnings.map((w) => `${questionIdentifier}: ${w}`);
        return warns.concat(newWarns);
      }
      return warns;
    };
    let warnings = [];
    warnings = sr.questionAggregates.first.reduce<string[]>(getAllQWarningsPrefixedWithQ, warnings);
    warnings = sr.questionAggregates.last.reduce<string[]>(getAllQWarningsPrefixedWithQ, warnings);
    warnings = sr.questionAggregates.delta.reduce<string[]>(getAllQWarningsPrefixedWithQ, warnings);
    warnings = warnings.filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });
    return warnings;
  }

  private getWarnings(sr: IJOCServiceReport, qs: IOutcomeSet): string[] {
    let warns = sr.warnings;
    warns = warns.concat(this.getQuestionWarnings(sr, qs));
    warns = warns.concat(this.getCategoryWarnings(sr, qs));
    return warns;
  }

  public render() {
    const warnings = this.getWarnings(this.props.serviceReport, this.props.questionSet);
    return (
      <ReportDetails
        includedBeneficiaries={this.props.serviceReport.beneficiaryIDs}
        excluded={this.props.serviceReport.excluded}
        warnings={warnings}
        questionSet={this.props.questionSet}
      />
    );
  }
}

export {ServiceReportDetails}
