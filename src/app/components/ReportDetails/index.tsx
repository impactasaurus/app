import * as React from 'react';
import {IExcluded} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {Message, Accordion, Label} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';
import './style.less';

interface IProp {
  includedBeneficiaries: string[];
  excluded: IExcluded;
  warnings: string[];
  questionSet: IOutcomeSet;
  // N beneficiaries have been excluded because :excludedReason
  excludedReason?: string;
}

class ReportDetails extends React.Component<IProp, any> {

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

  private renderOverview(includedBens: string[], excluded: IExcluded, qs: IOutcomeSet, excludedReason = 'they only have a single assessment'): JSX.Element {
    const noBens = includedBens.length;
    const info = noBens > 0;
    const title = info ? 'Overview of Report Content' : 'Report failed';
    const panels = [];

    if (noBens > 0) {
      panels.push({
        title: `This report aggregates data covering ${this.dealWithSingularOrMultiple(noBens, 'beneficiary', 'beneficiaries')}.`,
        content: (
          <div>
            {includedBens.map((bID) => (<Label key={bID}>{bID}</Label>))}
          </div>
        ),
      });
    }
    if (excluded.beneficiaryIDs.length > 0) {
      panels.push({
        title: `${this.dealWithSingularOrMultiple(excluded.beneficiaryIDs.length, 'beneficiary has', 'beneficiaries have')} been excluded because ${excludedReason}.`,
        content: (
          <div>
            {excluded.beneficiaryIDs.map((bID) => (<Label key={bID}>{bID}</Label>))}
          </div>
        ),
      });
    }
    if (excluded.categoryIDs.length > 0 || excluded.questionIDs.length > 0) {
      panels.push({
        title: `${this.dealWithSingularOrMultiple(excluded.categoryIDs.length, 'category', 'categories')} and ${this.dealWithSingularOrMultiple(excluded.questionIDs.length, 'question', 'questions')} have been excluded because they are not present within the assessments.`,
        content: (
          <div>
            {excluded.categoryIDs.map((cID) => (<Label key={cID}>{this.getCategoryString(cID, qs)}</Label>))}
            {excluded.questionIDs.map((qID) => (<Label key={qID}>{this.getQuestionString(qID, qs)}</Label>))}
          </div>
        ),
      });
    }
    return (
      <Message info={info} error={!info} className="report-overview">
        <Message.Header>{title}</Message.Header>
        <Accordion exclusive={false} panels={panels} />
      </Message>
    );
  }

  private renderWarning(str: string): JSX.Element {
    return (<div key={str}>{str}</div>);
  }

  private renderWarnings(warnings: string[]): JSX.Element {
    if (!Array.isArray(warnings) || warnings.length === 0) {
      return (<div />);
    }
    return (
      <Message warning>
        <Message.Header>Warnings</Message.Header>
        {renderArray<string>(this.renderWarning, warnings)}
      </Message>
    );
  }

  public render() {
    return (
      <div className="report-details">
        {this.renderOverview(this.props.includedBeneficiaries, this.props.excluded, this.props.questionSet, this.props.excludedReason)}
        {this.renderWarnings(this.props.warnings)}
      </div>
    );
  }
}

export {ReportDetails}
