import * as React from 'react';
import {IJOCServiceReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ImpactTable, IRow} from 'components/ImpactTable';

interface IProp {
  serviceReport: IJOCServiceReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

class ServiceReportTable extends React.Component<IProp, any> {

  private getCategoryRows(p: IProp): IRow[] {
    return p.serviceReport.categoryAggregates.first.map((first): IRow => {
      const last = p.serviceReport.categoryAggregates.last.find((x) => x.categoryID === first.categoryID);
      const category = p.questionSet.categories.find((x) => x.id === first.categoryID);
      if (last === undefined) {
        return null;
      }
      return {
        name: category ? category.name : 'Unknown',
        first: first.value,
        last: last.value,
      };
    });
  }

  private getQuestionRows(p: IProp): IRow[] {
    return p.serviceReport.questionAggregates.first.map((first): IRow => {
      const last = p.serviceReport.questionAggregates.last.find((x) => x.questionID === first.questionID);
      const question = p.questionSet.questions.find((x) => x.id === first.questionID);
      if (last === undefined) {
        return null;
      }
      return {
        name: question ? question.question : 'Unknown',
        first: first.value,
        last: last.value,
      };
    });
  }

  private renderTable(p: IProp): JSX.Element {
    const rows = p.category ? this.getCategoryRows(p) : this.getQuestionRows(p);
    if (rows.length === 0) {
      return (<div/>);
    }
    rows.sort((a, b) => a.name.localeCompare(b.name));
    return (
      <ImpactTable
        data={rows}
        nameColName={p.category ? 'Category' : 'Question'}
      />
    );
  }

  public render() {
    return (
      <div className="service-report-table">
        {this.renderTable(this.props)}
      </div>
    );
  }
}

export {ServiceReportTable}
