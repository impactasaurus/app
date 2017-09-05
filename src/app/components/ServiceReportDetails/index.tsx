import * as React from 'react';
import {IJOCServiceReport, IQuestionAggregates, ICategoryAggregates} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {Message} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';
import './style.less';

interface IProp {
  serviceReport: IJOCServiceReport;
  questionSet: IOutcomeSet;
}

class ServiceReportDetails extends React.Component<IProp, any> {

  private dealWithSingularOrMultiple(num: number, singular: string, multiple: string): string {
    if (num === 1) {
      return `${num} ${singular}`;
    }
    return `${num} ${multiple}`;
  }

  private renderOverview(sr: IJOCServiceReport): JSX.Element {
    const noBens = sr.beneficiaryIDs.length;
    const info = noBens > 0 ? true : false;
    const title = info ? 'Overview of Report Content' : 'Report failed';
    return (
      <Message info={info} error={!info} className="service-overview">
        <Message.Header>{title}</Message.Header>
        <p className="ben-count">
          {this.dealWithSingularOrMultiple(noBens, 'beneficiary has', 'beneficiaries have')} been included in this report.
        </p>
        <p className="ben-excluded">
          {this.dealWithSingularOrMultiple(sr.excluded.beneficiaryIDs.length, 'beneficiary has', 'beneficiaries have')} been excluded because they only have a single assessment.
        </p>
        <p className="qc-excluded">
          {this.dealWithSingularOrMultiple(sr.excluded.categoryIDs.length, 'category', 'categories')} and {this.dealWithSingularOrMultiple(sr.excluded.questionIDs.length, 'question', 'questions')} have been excluded because they are not present within the assessments.
        </p>
      </Message>
    );
  }

  private renderWarning(str: string): JSX.Element {
    return (<div>{str}</div>);
  }

  private getCategoryWarnings(sr: IJOCServiceReport, qs: IOutcomeSet): string[] {
    const getAllCatWarningsPrefixedWithCatName = (warns: string[], v: ICategoryAggregates): string[] => {
      if (Array.isArray(v.warnings) && v.warnings.length > 0) {
        const cat = qs.categories.find((c) => c.id === v.categoryID);
        const newWarns = v.warnings.map((w) => {
          if (cat === undefined) {
            return `${v.categoryID}: ${w}`;
          } else {
            return `${cat.name}: ${w}`;
          }
        });
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
        const question = qs.questions.find((q) => q.id === v.questionID);
        const newWarns = v.warnings.map((w) => {
          if (question === undefined) {
            return `${v.questionID}: ${w}`;
          } else {
            return `${question.question}: ${w}`;
          }
        });
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

  private renderWarnings(sr: IJOCServiceReport, qs: IOutcomeSet): JSX.Element {
    let warns = sr.warnings;
    warns = warns.concat(this.getQuestionWarnings(sr, qs));
    warns = warns.concat(this.getCategoryWarnings(sr, qs));
    if (!Array.isArray(warns) || warns.length === 0) {
      return (<div />);
    }
    return (
      <Message warning>
        <Message.Header>Warnings</Message.Header>
        {renderArray<string>(this.renderWarning, warns)}
      </Message>
    );
  }

  public render() {
    return (
      <div className="service-report-details">
        {this.renderOverview(this.props.serviceReport)}
        {this.renderWarnings(this.props.serviceReport, this.props.questionSet)}
      </div>
    );
  }
}

export {ServiceReportDetails}
