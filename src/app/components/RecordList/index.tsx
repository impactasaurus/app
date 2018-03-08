import * as React from 'react';
import {Table, IconProps, Label, Icon, Popup, Button} from 'semantic-ui-react';
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

interface IState {
  open: string[];
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class RecordListInner extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      open: [],
    };

    this.renderRecord = this.renderRecord.bind(this);
    this.toggleRecord = this.toggleRecord.bind(this);
  }

  private toggleRecord(r: IMeeting): () => void {
    return () => {
      if (this.state.open.indexOf(r.id) === -1) {
        this.setState({
          open: this.state.open.concat(r.id),
        });
      } else {
        this.setState({
          open: this.state.open.filter((i) => i !== r.id),
        });
      }
    };
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

  private delete(m: IMeeting): () => Promise<any> {
    return () => {
      return this.props.deleteMeeting(m.id, m.beneficiary);
    };
  }

  private renderActions(r: IMeeting): JSX.Element[] {
    const actions: JSX.Element[] = [];
    actions.push((<ConfirmButton onConfirm={this.delete(r)} promptText="Are you sure you want to delete this record?" buttonProps={{icon: 'delete', compact:true, size:'tiny'}} tooltip="Delete" />));
    if (r.incomplete) {
      actions.push((<Popup key="continue" trigger={<Button onClick={this.resume(r)} icon="arrow right" compact size="tiny" />} content="Continue" />));
    }
    return actions;
  }

  private renderRecord(r: IMeeting, idx: number): JSX.Element[] {
    let clz = 'record';
    if (idx % 2 !== 0) {
      clz += ' stripe';
    }
    const open = this.state.open.find((o) => o === r.id);
    const iconProps: IconProps = {};
    if (!open) {
      iconProps.rotated = 'counterclockwise';
    }
    let incomplete = (<span/>);
    if (r.incomplete) {
      incomplete = (<Popup trigger={<Icon name="hourglass half"/>} content="Incomplete" /> );
    }
    return [
      <Table.Row className={clz} key={r.id}>
        <Table.Cell className="name" onClick={this.toggleRecord(r)}>
          {incomplete}
          <span>{getHumanisedDate(new Date(r.conducted))}</span>
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
        <Table celled={true} className="record-list-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Questionnaire</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
              <Table.HeaderCell>Conducted</Table.HeaderCell>
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
