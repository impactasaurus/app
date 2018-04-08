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

/**
 * Simple sum function that sums the numbers in a number[]
 * undefined elements are skipped.
 * If all elements in the array are undefined then zero is returned.
 */

function sum(numArray: number[]): number {
  let total: number = 0;
  for(const num of numArray) {
    if(num !== undefined) {
      total += num;
    }
  }
  return total;
}

/**
 * Simple average function that computes the arithmetic mean
 * of numbers in a number[].
 * Counts the number of valid values i.e. values that are not undefined
 * and divides the sum of the numbers by that count.
 * if an empty array is passed then 0 is returned.
 */

function average(numArray: number[]): number {
  if(numArray.length === 0) {
    return 0;
  }
  const arraySum = sum(numArray);
  let validValues = 0; // number of cells that are not undefined
  for(const num of numArray) {
    if(num !== undefined) {
      validValues += 1;
    }
  }

  if(validValues === 0) {
    return 0; // to avoid dividing by zero in case all cells are undefined
  }
  return arraySum / validValues;
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

  private renderTable(p: IProp): JSX.Element {
    if (p.data.length === 0) {
      return (<div />);
    }
    const rows = p.data;
    const initialColumnValues = rows.map((row) => row.first); // get values from initial column
    const latestColumnValues = rows.map((row) => row.last); // get values from latest column
    const differenceColumnValues = rows.map(delta); // get values from difference column
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
          <Table.Row>
            <Table.Cell>
              <Header as="h5" textAlign="left">Total</Header>
            </Table.Cell>
            <Table.Cell>{sum(initialColumnValues).toFixed(2)}</Table.Cell>
            <Table.Cell>{sum(latestColumnValues).toFixed(2)}</Table.Cell>
            <Table.Cell>{sum(differenceColumnValues).toFixed(2)}</Table.Cell>
          </Table.Row>
          <Table.Row>
              <Table.Cell>
                <Header as="h5" textAlign="left">Average</Header>
              </Table.Cell>
              <Table.Cell>{average(initialColumnValues).toFixed(2)}</Table.Cell>
              <Table.Cell>{average(latestColumnValues).toFixed(2)}</Table.Cell>
              <Table.Cell>{average(differenceColumnValues).toFixed(2)}</Table.Cell>
          </Table.Row>
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
