import * as React from 'react';
import { Table, Header } from 'semantic-ui-react';
import { renderArray } from 'helpers/react';

interface IRow {
  name: string;
  first: number|undefined;
  last: number|undefined;
}

interface IProp {
  data: IRow[];
  nameColName: string;
  firstColName?: string;
  lastColName?: string;
}

function delta(r: IRow): number|undefined {
  if (r.last === undefined || r.first === undefined) {
    return undefined;
  }
  return r.last - r.first;
}

class ImpactTable extends React.Component<IProp, any> {

  private renderRow(r: IRow): JSX.Element {
    const d = delta(r);
    return (
      <Table.Row key={r.name}>
        <Table.Cell>{r.name}</Table.Cell>
        <Table.Cell>{r.first === undefined ? 'N/A' : r.first.toFixed(2)}</Table.Cell>
        <Table.Cell>{r.last === undefined ? 'N/A' : r.last.toFixed(2)}</Table.Cell>
        <Table.Cell>{d === undefined ? 'N/A' : d.toFixed(2)}</Table.Cell>
      </Table.Row>
    );
  }

  private sortByDelta(rows: IRow[]): IRow[] {
    return rows
    .filter((r) => r !== null)
    .sort((a, b) => {
      return delta(a) - delta(b);
    });
  }

  private sumInitialColumn(rows: IRow[]): number | undefined {
    let initialColumnSum: number = 0;
    for(const row of rows) {
      if(row.first === undefined) {
        return undefined;
      }
      initialColumnSum += row.first;
    }
    return initialColumnSum;
  }

  private sumLatestColumn(rows: IRow[]): number | undefined {
    let latestColumnSum: number = 0;
    for(const row of rows) {
      if(row.last === undefined) {
        return undefined;
      }
      latestColumnSum += row.last;
    }
    return latestColumnSum;
  }

  private sumDifferenceColumn(rows: IRow[]): number | undefined {
    let differenceColumnSum: number = 0;
    for(const row of rows) {
      const d = delta(row);
      if(d === undefined) {
        return undefined;
      }
      differenceColumnSum += d;
    }
    return differenceColumnSum;
  }

  private renderTable(p: IProp): JSX.Element {
    if (p.data.length === 0) {
      return (<div />);
    }
    const rows = this.sortByDelta(p.data);
    const initialColumnSum = this.sumInitialColumn(rows);
    const latestColumnSum = this.sumLatestColumn(rows);
    const differenceColumnSum = this.sumDifferenceColumn(rows);
    return (
      <Table striped={true} celled={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{p.nameColName}</Table.HeaderCell>
            <Table.HeaderCell>{p.firstColName || 'Initial'}</Table.HeaderCell>
            <Table.HeaderCell>{p.lastColName || 'Latest'}</Table.HeaderCell>
            <Table.HeaderCell>Difference</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {renderArray(this.renderRow, rows)}
        </Table.Body>

        <Table.Row>
            <Table.Cell>
              <Header as="h5" textAlign="left">Total</Header>
            </Table.Cell>
            <Table.Cell>{initialColumnSum.toFixed(2)}</Table.Cell>
            <Table.Cell>{latestColumnSum.toFixed(2)}</Table.Cell>
            <Table.Cell>{differenceColumnSum.toFixed(2)}</Table.Cell>
        </Table.Row>
        <Table.Row>
            <Table.Cell>
              <Header as="h5" textAlign="left">Average</Header>
            </Table.Cell>
            <Table.Cell>{initialColumnSum === undefined ? 'N/A' : (initialColumnSum/rows.length).toFixed(2)}</Table.Cell>
            <Table.Cell>{latestColumnSum === undefined ? 'N/A' : (latestColumnSum/rows.length).toFixed(2)}</Table.Cell>
            <Table.Cell>{differenceColumnSum === undefined ? 'N/A' : (differenceColumnSum/rows.length).toFixed(2)}</Table.Cell>
        </Table.Row>
      </Table>
    );
  }

  public render() {
    return (
      <div className="impact-table">
        {this.renderTable(this.props)}
      </div>
    );
  }
}

export {ImpactTable, IRow}
