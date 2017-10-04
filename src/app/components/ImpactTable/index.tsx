import * as React from 'react';
import {Table} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';

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

  private renderTable(p: IProp): JSX.Element {
    if (p.data.length === 0) {
      return (<div />);
    }
    const rows = this.sortByDelta(p.data);
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
