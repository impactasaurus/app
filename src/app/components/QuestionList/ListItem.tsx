import * as React from 'react';
import {Question} from 'models/question';
import { List, Button, Popup } from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {ConfirmButton} from 'components/ConfirmButton';
import {CategoryPill} from 'components/CategoryPill';
import {IOutcomeSet} from 'models/outcomeSet';
import {SortableElement} from 'react-sortable-hoc';
import {Handle} from './Handle';

interface IProps {
  questionnaire: IOutcomeSet;
  outcomeSetID: string;
  question: Question;
  editQuestion: () => void;
  deleteQuestion: () => Promise<IOutcomeSet>;
  categoryPillStyle: string;
  draggable: boolean;
  readOnly?: boolean; // defaults to false
}

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

class ListItemInner extends React.Component<IProps, any> {

  public render() {
    const {question, editQuestion, categoryPillStyle, deleteQuestion, readOnly} = this.props;
    const editButton = <Button onClick={editQuestion} icon="edit" tooltip="Edit" compact={true} size="tiny" />;
    const editable = readOnly !== true;

    return (
      <List.Item className="question" key={question.id}>
        {editable && <Handle draggable={this.props.draggable} />}
        <List.Content verticalAlign="middle">
          <List.Header>{getQuestionTitle(question)}</List.Header>
          <List.Description>{getQuestionDescription(question)}</List.Description>
        </List.Content>
        <List.Content floated="right" verticalAlign="middle">
          <CategoryPill outcomeSetID={this.props.outcomeSetID} questionID={question.id} readOnly={readOnly}
                        cssClass={categoryPillStyle} questionnaire={this.props.questionnaire}/>
          {editable && <Popup trigger={editButton} content="Edit"/>}
          {editable && <ConfirmButton
            onConfirm={deleteQuestion}
            promptText="Are you sure you want to archive this question?"
            buttonProps={{icon: 'archive', compact: true, size: 'tiny'}}
            tooltip="Archive"/>
          }
        </List.Content>
      </List.Item>
    );
  }
}

export const ListItem = SortableElement(ListItemInner);
