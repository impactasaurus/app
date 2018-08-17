import * as React from 'react';
import {IOutcomeResult} from '../../apollo/modules/outcomeSets';
import {Question} from 'models/question';
import { List, Button, Popup, Icon } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {ConfirmButton} from 'components/ConfirmButton';
import {CategoryPill} from 'components/CategoryPill';
import {IOutcomeSet} from '../../models/outcomeSet';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';
const Grip = require('./grip-vertical-solid.inline.svg');

interface IProps {
  data: IOutcomeResult;
  outcomeSetID: string;
  question: Question;
  editQuestion: () => void;
  deleteQuestion: () => Promise<IOutcomeSet>;
  categoryPillStyle: string;
  draggable: boolean;

  questionMoving: boolean;
  questionMovingError: boolean;
}

const DragHandle = SortableHandle(() => <Grip style={{height:'0.8em', color: 'grey', cursor: 'move', paddingLeft: '3px'}} />);

function getQuestionDescription(q: Question): string {
  const description = q.description || '';

  if (q.leftLabel || q.rightLabel) {
    if (description) {
      return `${description} (${q.leftLabel} > ${q.rightLabel})`;
    }
    return `${q.leftLabel} > ${q.rightLabel}`;
  }
  return description;
}

function getQuestionTitle(q: Question): string {
  if (!isNullOrUndefined(q.short) && q.short !== '') {
    return `${q.question} [${q.short}]`;
  }
  return q.question;
}

function renderHandle(p: IProps): JSX.Element {
  if (p.questionMoving) {
    return (<Icon name="spinner" loading={true} />);
  }
  if (p.questionMovingError) {
    return (<Icon name="exclamation" />);
  }
  if (p.draggable) {
    return (<DragHandle />);
  }
  return (<span />);
}

class ListItemInner extends React.Component<IProps, any> {

  public render() {
    const {question, editQuestion, categoryPillStyle, deleteQuestion} = this.props;
    const editButton = <Button onClick={editQuestion} icon="edit" tooltip="Edit" compact={true} size="tiny" />;

    return (
      <List.Item className="question" key={question.id}>
        <List.Content floated="right" verticalAlign="middle">
          <CategoryPill outcomeSetID={this.props.outcomeSetID} questionID={question.id}
                        cssClass={categoryPillStyle} data={this.props.data}/>
          <Popup trigger={editButton} content="Edit"/>
          <ConfirmButton onConfirm={deleteQuestion}
                         promptText="Are you sure you want to archive this question?"
                         buttonProps={{icon: 'archive', compact: true, size: 'tiny'}} tooltip="Archive"/>
          {renderHandle(this.props)}
        </List.Content>
        <List.Content verticalAlign="middle">
          <List.Header>{getQuestionTitle(question)}</List.Header>
          <List.Description>{getQuestionDescription(question)}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export const ListItem = SortableElement(ListItemInner);
