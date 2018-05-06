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

enum Direction {
  ASC,
  DESC,
}

function directionSpec(d: Direction): 'ascending'|'descending' {
  return d === Direction.ASC ? 'ascending' : 'descending';
}

enum Column {
  NAME,
  FIRST,
  LAST,
  DELTA,
}

interface IState {
  column: Column;
  direction: Direction;
  data: IRow[];
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

function sortData(data: IRow[], column: Column, direction: Direction): IRow[] {
  return data.concat().sort((a, b) => {
    const adjustResponseOnDirection = (resp: number): number => {
      return (direction === Direction.ASC) ? resp: -resp;
    };
    if (column === Column.NAME) {
      return adjustResponseOnDirection(a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
    let aVal: number|undefined, bVal: number|undefined;
    if (column === Column.FIRST) {
      aVal = a.first;
      bVal = b.first;
    } else if (column === Column.LAST) {
      aVal = a.last;
      bVal = b.last;
    } else if (column === Column.DELTA) {
      aVal = delta(a);
      bVal = delta(b);
    }
    if (aVal === undefined && bVal !== undefined) {
      return adjustResponseOnDirection(-1);
    } else if (bVal === undefined && aVal !== undefined) {
      return adjustResponseOnDirection(1);
    } else if (aVal === undefined && bVal === undefined) {
      return adjustResponseOnDirection(0);
    }
    return adjustResponseOnDirection(aVal - bVal);
  });
}

function renderRow(r: IRow): JSX.Element {
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

class ImpactTable extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      column: Column.NAME,
      direction: Direction.ASC,
    };
    this.handleSort = this.handleSort.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  public componentWillReceiveProps(nextProps: IProp) {
    this.setState({
      column: this.state.column,
      data: sortData(nextProps.data, this.state.column, this.state.direction),
      direction: this.state.direction,
    });
  }

  private handleSort(column: Column): () => void {
    return () => {
      if (column !== this.state.column) {
        return this.setState({
          column,
          data: sortData(this.state.data, column, Direction.ASC),
          direction: Direction.ASC,
        });
      }
      const newDir = (this.state.direction === Direction.ASC) ? Direction.DESC : Direction.ASC;
      this.setState({
        column: this.state.column,
        data: sortData(this.state.data, this.state.column, newDir),
        direction: newDir,
      });
    };
  }

  private renderTable(): JSX.Element {
    if (this.state.data.length === 0) {
      return (<div />);
    }
    const rows = this.state.data;
    const initialColumnValues = rows.map((row) => row.first); // get values from initial column
    const latestColumnValues = rows.map((row) => row.last); // get values from latest column
    const differenceColumnValues = rows.map(delta); // get values from difference column
    return (
      <Table striped={true} celled={true} sortable={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={this.state.column === Column.NAME ? directionSpec(this.state.direction) : null} onClick={this.handleSort(Column.NAME)}>{this.props.nameColName}</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.FIRST ? directionSpec(this.state.direction) : null} onClick={this.handleSort(Column.FIRST)}>{this.props.firstColName || 'Initial'}</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.LAST ? directionSpec(this.state.direction) : null} onClick={this.handleSort(Column.LAST)}>{this.props.lastColName || 'Latest'}</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.DELTA ? directionSpec(this.state.direction) : null} onClick={this.handleSort(Column.DELTA)}>Difference</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {renderArray(renderRow, rows)}
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
        {this.renderTable()}
      </div>
    );
  }
}

export {ImpactTable, IRow}
