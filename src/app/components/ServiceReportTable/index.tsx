import * as React from 'react';
import {IJOCServiceReport} from 'models/report';
import {IOutcomeSet} from 'models/outcomeSet';
import {Table} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';

interface IProp {
  serviceReport: IJOCServiceReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

interface IRow {
  name: string;
  first: number;
  last: number;
  delta: number;
}

class ServiceReportTable extends React.Component<IProp, any> {

  private renderRow(r: IRow): JSX.Element {
    return (
      <Table.Row>
        <Table.Cell>{r.name}</Table.Cell>
        <Table.Cell>{r.first}</Table.Cell>
        <Table.Cell>{r.last}</Table.Cell>
        <Table.Cell>{r.delta}</Table.Cell>
      </Table.Row>
    );
  }

  private getCategoryRows(p: IProp): IRow[] {
    return p.serviceReport.categoryAggregates.first.map((first): IRow => {
      const last = p.serviceReport.categoryAggregates.last.find((x) => x.categoryID === first.categoryID);
      const delta = p.serviceReport.categoryAggregates.delta.find((x) => x.categoryID === first.categoryID);
      const category = p.questionSet.categories.find((x) => x.id === first.categoryID);
      if (last === undefined || delta === undefined) {
        return null;
      }
      return {
        name: category ? category.name : 'Unknown',
        first: first.value,
        last: last.value,
        delta: delta.value,
      };
    });
  }

  private getQuestionRows(p: IProp): IRow[] {
    return p.serviceReport.questionAggregates.first.map((first): IRow => {
      const last = p.serviceReport.questionAggregates.last.find((x) => x.questionID === first.questionID);
      const delta = p.serviceReport.questionAggregates.delta.find((x) => x.questionID === first.questionID);
      const question = p.questionSet.questions.find((x) => x.id === first.questionID);
      if (last === undefined || delta === undefined) {
        return null;
      }
      return {
        name: question ? question.question : 'Unknown',
        first: first.value,
        last: last.value,
        delta: delta.value,
      };
    });
  }

  private sortByDelta(rows: IRow[]): IRow[] {
    return rows
    .filter((r) => r !== null)
    .sort((a, b) => {
      return a.delta - b.delta;
    });
  }

  private renderTable(p: IProp): JSX.Element {
    let rows = p.category ? this.getCategoryRows(p) : this.getQuestionRows(p);
    if (rows.length === 0) {
      return (<div />);
    }
    rows = this.sortByDelta(rows);
    return (
      <Table striped={true} sortable={true} celled={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{p.category ? 'Category' : 'Question'}</Table.HeaderCell>
            <Table.HeaderCell>Initial</Table.HeaderCell>
            <Table.HeaderCell>Latest</Table.HeaderCell>
            <Table.HeaderCell>Difference</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {renderArray(this.renderRow, rows)}
        </Table.Body>
      </Table>
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
