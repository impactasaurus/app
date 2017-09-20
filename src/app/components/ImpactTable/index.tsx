import * as React from 'react';
import {Table} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';

interface IRow {
  name: string;
  first: number;
  last: number;
}

interface IProp {
  data: IRow[];
  nameColName: string;
  firstColName?: string;
  lastColName?: string;
}

function delta(r: IRow): number {
  return r.last - r.first;
}

class ImpactTable extends React.Component<IProp, any> {

  private renderRow(r: IRow): JSX.Element {
    return (
      <Table.Row key={r.name}>
        <Table.Cell>{r.name}</Table.Cell>
        <Table.Cell>{r.first}</Table.Cell>
        <Table.Cell>{r.last}</Table.Cell>
        <Table.Cell>{delta(r)}</Table.Cell>
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
