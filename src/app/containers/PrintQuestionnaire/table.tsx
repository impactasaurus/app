import * as React from 'react';
import {ILikertScale} from 'models/question';
import {Table} from 'semantic-ui-react';
import {renderArray} from 'helpers/react';
import {compiledScale, modeScale} from 'helpers/likert';

interface IProps {
  questions: ILikertScale[];
}

const labelOrder = (questions: ILikertScale[]): string[] => {
  const mode = modeScale(questions);
  const scale = compiledScale(mode);
  return scale.map((l) => l.label ? l.label : '');
};

const tableHeader = (p: IProps): JSX.Element => {
  const labels = labelOrder(p.questions);
  const cells: JSX.Element[] = labels.map((l, idx) => (
    <Table.HeaderCell key={`${l}-${idx}`} style={{minWidth: '4em'}}>{l}</Table.HeaderCell>
  ));
  cells.unshift(<Table.HeaderCell key={'blank'}/>);
  return (
    <Table.Row key={'header'}>
      {cells}
    </Table.Row>
  );
};

const tableRow = (q: ILikertScale, _: number, arr: ILikertScale[]): JSX.Element => {
  const labels = labelOrder(arr);
  const cells: JSX.Element[] = [<Table.Cell key={q.id}>{q.question}</Table.Cell>];
  labels.forEach((l, idx) => {
    cells.push(<Table.Cell key={`${l}-${idx}`} />);
  });
  return (
    <Table.Row key={q.id}>
      {cells}
    </Table.Row>
  );
};

export const PrintTable = (p: IProps) => (
  <div>
    <Table celled={true}>
      <Table.Header>
        {tableHeader(p)}
      </Table.Header>
      <Table.Body>
        {renderArray(tableRow, p.questions)}
      </Table.Body>
    </Table>
  </div>
);
