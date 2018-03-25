import * as React from 'react';
import {Table, Label, Icon, Popup, Button} from 'semantic-ui-react';
import './style.less';
import {IMeeting, sortMeetingsByConducted} from '../../models/meeting';
import {renderArray, renderArrayForArray} from '../../helpers/react';
import {getHumanisedDate} from '../../helpers/moment';
import {IURLConnector} from 'redux/modules/url';
import {setURL} from 'redux/modules/url';
import {bindActionCreators} from 'redux';
import {deleteMeeting, IDeleteMeetingMutation} from 'apollo/modules/meetings';
import {ConfirmButton} from 'components/ConfirmButton';
const { connect } = require('react-redux');

interface IProp extends IURLConnector, IDeleteMeetingMutation {
  meetings: IMeeting[];
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class RecordListInner extends React.Component<IProp, any> {

  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.resume = this.resume.bind(this);
    this.delete = this.delete.bind(this);
    this.renderRecord = this.renderRecord.bind(this);
  }

  private renderTag(t: string): JSX.Element {
    return (
      <Label key={t}>{t}</Label>
    );
  }

  private resume(m: IMeeting): () => void {
    return () => {
      this.props.setURL(`/meeting/${m.id}`);
    };
  }

  private edit(m: IMeeting): () => void {
    return () => {
      this.props.setURL(`/meeting/${m.id}/edit`, `?next=${window.location.pathname}`);
    };
  }

  private delete(m: IMeeting): () => Promise<any> {
    return () => {
      return this.props.deleteMeeting(m.id, m.beneficiary);
    };
  }

  private renderActions(r: IMeeting): JSX.Element[] {
    const actions: JSX.Element[] = [];
    actions.push((<ConfirmButton onConfirm={this.delete(r)} promptText="Are you sure you want to delete this record?" buttonProps={{icon: 'delete', compact:true, size:'tiny'}} tooltip="Delete" />));
    actions.push((<Popup key="edit" trigger={<Button onClick={this.edit(r)} icon="edit" compact size="tiny" />} content="Edit" />));
    if (r.incomplete) {
      actions.push((<Popup key="continue" trigger={<Button onClick={this.resume(r)} icon="arrow right" compact size="tiny" />} content="Continue" />));
    }
    return actions;
  }

  private renderRecord(r: IMeeting): JSX.Element[] {
    let incomplete = (<span/>);
    if (r.incomplete) {
      incomplete = (<Popup trigger={<Icon name="hourglass half"/>} content="Incomplete" /> );
    }
    return [
      <Table.Row key={r.id}>
        <Table.Cell>
          {incomplete}
          {getHumanisedDate(new Date(r.conducted))}
        </Table.Cell>
        <Table.Cell>{r.outcomeSet.name}</Table.Cell>
        <Table.Cell>{renderArray(this.renderTag, r.tags)}</Table.Cell>
        <Table.Cell>{r.user}</Table.Cell>
        <Table.Cell className="actions">{this.renderActions(r)}</Table.Cell>
      </Table.Row>,
    ];
  }

  public render() {
    return (
      <div id="record-list">
        <Table celled={true} striped={true} className="record-list-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Questionnaire</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
              <Table.HeaderCell>Conductor</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderArrayForArray(this.renderRecord, sortMeetingsByConducted(this.props.meetings, false))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const RecordList = deleteMeeting<IProp>(RecordListInner);
export { RecordList };
