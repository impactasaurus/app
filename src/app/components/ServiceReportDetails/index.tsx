import * as React from 'react';
import {IJOCServiceReport, IQuestionAggregates, ICategoryAggregates} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {Message, Accordion, Label} from 'semantic-ui-react';
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

  private renderOverview(sr: IJOCServiceReport, qs: IOutcomeSet): JSX.Element {
    const noBens = sr.beneficiaryIDs.length;
    const info = noBens > 0 ? true : false;
    const title = info ? 'Overview of Report Content' : 'Report failed';
    const panels = [];

    if (noBens > 0) {
      panels.push({
        title: `This report aggregates data covering ${this.dealWithSingularOrMultiple(noBens, 'beneficiary', 'beneficiaries')}.`,
        content: (
          <div>
            {sr.beneficiaryIDs.map((bID) => (<Label key={bID}>{bID}</Label>))}
          </div>
        ),
      });
    }
    if (sr.excluded.beneficiaryIDs.length > 0) {
      panels.push({
        title: `${this.dealWithSingularOrMultiple(sr.excluded.beneficiaryIDs.length, 'beneficiary has', 'beneficiaries have')} been excluded because they only have a single assessment.`,
        content: (
          <div>
            {sr.excluded.beneficiaryIDs.map((bID) => (<Label key={bID}>{bID}</Label>))}
          </div>
        ),
      });
    }
    if (sr.excluded.categoryIDs.length > 0 || sr.excluded.questionIDs.length > 0) {
      panels.push({
        title: `${this.dealWithSingularOrMultiple(sr.excluded.categoryIDs.length, 'category', 'categories')} and ${this.dealWithSingularOrMultiple(sr.excluded.questionIDs.length, 'question', 'questions')} have been excluded because they are not present within the assessments.`,
        content: (
          <div>
            {sr.excluded.categoryIDs.map((cID) => (<Label key={cID}>{this.getCategoryString(cID, qs)}</Label>))}
            {sr.excluded.questionIDs.map((qID) => (<Label key={qID}>{this.getQuestionString(qID, qs)}</Label>))}
          </div>
        ),
      });
    }
    return (
      <Message info={info} error={!info} className="service-overview">
        <Message.Header>{title}</Message.Header>
        <Accordion exclusive={false} panels={panels} />
      </Message>
    );
  }

  private renderWarning(str: string): JSX.Element {
    return (<div key={str}>{str}</div>);
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
        {this.renderOverview(this.props.serviceReport, this.props.questionSet)}
        {this.renderWarnings(this.props.serviceReport, this.props.questionSet)}
      </div>
    );
  }
}

export {ServiceReportDetails}
