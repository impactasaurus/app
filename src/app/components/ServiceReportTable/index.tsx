import * as React from 'react';
import {IAnswerAggregation, IAnswerAggregationReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {ImpactTable, IRow} from 'components/ImpactTable';

interface IProp {
  serviceReport: IAnswerAggregationReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

function getRowData(aa: IAnswerAggregation[], labeller: (IAnswerAggregation) => string): IRow[] {
  return aa.map((a): IRow => {
    return {
      name: labeller(a),
      last: a.latest,
      first: a.initial,
    };
  });
}

class ServiceReportTable extends React.Component<IProp, any> {

  private getCategoryRows(p: IProp): IRow[] {
    const categoryLabeller = (aa: IAnswerAggregation): string => {
      const category = p.questionSet.categories.find((x) => x.id === aa.id);
      return category ? category.name : 'Unknown';
    };
    return getRowData(p.serviceReport.categories, categoryLabeller);
  }

  private getQuestionRows(p: IProp): IRow[] {
    const qLabeller = (aa: IAnswerAggregation): string => {
      const question = p.questionSet.questions.find((x) => x.id === aa.id);
      return question ? (question.short || question.question) : 'Unknown';
    };
    return getRowData(p.serviceReport.questions, qLabeller);
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

export {ServiceReportTable};
