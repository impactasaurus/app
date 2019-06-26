import * as React from 'react';
import {IBeneficiaryDeltaReport} from 'models/report';
import {Table} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';
import {Direction, directionSpec} from 'helpers/table';
import {extractDeltas} from 'containers/DeltaReport/data';
import {IOutcomeSet} from 'models/outcomeSet';

interface IProp {
  report: IBeneficiaryDeltaReport;
  questionSet: IOutcomeSet;
  category?: boolean;
}

interface IState {
  column: Column;
  direction: Direction;
  data: IRow[];
}

interface IRow {
  name: string;
  decreased: number;
  same: number;
  increased: number;
}

enum Column {
  NAME,
  DEC,
  INC,
  SAME,
}

const renderRow = (r: IRow): JSX.Element => (
  <Table.Row key={r.name}>
    <Table.Cell>{r.name}</Table.Cell>
    <Table.Cell>{r.decreased}</Table.Cell>
    <Table.Cell>{r.same}</Table.Cell>
    <Table.Cell>{r.increased}</Table.Cell>
  </Table.Row>
);

function sortData(data: IRow[], column: Column, direction: Direction): IRow[] {
  return data.concat().sort((a, b) => {
    const adjustResponseOnDirection = (resp: number): number => {
      return (direction === Direction.ASC) ? resp: -resp;
    };
    if (column === Column.NAME) {
      return adjustResponseOnDirection(a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
    let aVal: number|undefined, bVal: number|undefined;
    if (column === Column.DEC) {
      aVal = a.decreased;
      bVal = b.decreased;
    } else if (column === Column.SAME) {
      aVal = a.same;
      bVal = b.same;
    } else if (column === Column.INC) {
      aVal = a.increased;
      bVal = b.increased;
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

const getRows = (p: IProp): IRow[] => {
  const data = extractDeltas(p.category, p.report, p.questionSet);
  return data.map((d) => ({
    name: d.label,
    increased: d.increased,
    decreased: d.decreased,
    same: d.same,
  }));
};

export class DeltaTable extends React.Component<IProp, IState> {

  constructor(props: IProp) {
    super(props);
    this.state = {
      column: Column.NAME,
      direction: Direction.ASC,
      data: getRows(props),
    };
    this.handleSort = this.handleSort.bind(this);
  }

  public componentWillReceiveProps(nextProps: IProp) {
    const newRows = getRows(nextProps);
    this.setState({
      column: this.state.column,
      data: sortData(newRows, this.state.column, this.state.direction),
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

  public render() {
    const rows = this.state.data;
    const nameCol = this.props.category ? 'Category' : 'Question';
    return (
      <Table striped={true} celled={true} sortable={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={this.state.column === Column.NAME ? directionSpec(this.state.direction) : null}
                              onClick={this.handleSort(Column.NAME)}>{nameCol}</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.DEC ? directionSpec(this.state.direction) : null}
                              onClick={this.handleSort(Column.DEC)}>Decreased</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.SAME ? directionSpec(this.state.direction) : null}
                              onClick={this.handleSort(Column.SAME)}>Same</Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.column === Column.INC ? directionSpec(this.state.direction) : null}
                              onClick={this.handleSort(Column.INC)}>Increased</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {renderArray(renderRow, rows)}
        </Table.Body>
      </Table>
    );
  }
}
