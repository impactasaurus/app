import * as React from 'react';
import {Table, Icon, IconProps} from 'semantic-ui-react';
import './style.less';
// import {Hint} from 'components/Hint';
import {IMeeting, sortMeetingsByConducted} from '../../models/meeting';
import {renderArray} from '../../helpers/react';
import {getHumanisedDate} from '../../helpers/moment';

interface IProp {
  meetings: IMeeting[];
}

interface IState {
  open: string[];
}

class RecordList extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      open: [],
    };

    this.renderRecord = this.renderRecord.bind(this);
    this.toggleRecord = this.toggleRecord.bind(this);
  }

  public renderInner() {
    return (
      <Table.Row className="record-inner">
        <Table.Cell colSpan="4">
          <p>These are some notes associated with the record</p>
          <Table basic className="question-list-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Question</Table.HeaderCell>
                <Table.HeaderCell>Answer</Table.HeaderCell>
                <Table.HeaderCell>Notes</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row className="question">
                <Table.Cell className="name">Do you help people?</Table.Cell>
                <Table.Cell>4</Table.Cell>
                <Table.Cell>
                  Wow really long note<br />
                  Wow really long note<br />
                  Wow really long note
                </Table.Cell>
              </Table.Row>
              <Table.Row className="question">
                <Table.Cell className="name">Do you talk to others?</Table.Cell>
                <Table.Cell>5</Table.Cell>
                <Table.Cell />
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
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

  private renderRecord(r: IMeeting, idx: number): JSX.Element {
    let clz = 'record';
    if (idx % 2 !== 0) {
      clz += ' stripe';
    }
    const open = this.state.open.find((o) => o === r.id);
    const iconProps: IconProps = {};
    if (!open) {
      iconProps.rotated = 'counterclockwise';
    }
    return (
      <Table.Row className={clz}>
        <Table.Cell className="name" onClick={this.toggleRecord(r)}>
          <Icon name="dropdown" {...iconProps} />
          <span>{getHumanisedDate(new Date(r.conducted))}</span>
        </Table.Cell>
        <Table.Cell>{r.outcomeSet.name}</Table.Cell>
        <Table.Cell>{r.user}</Table.Cell>
      </Table.Row>
    );
  }

  public render() {
    return (
      <div id="record-list">
        <Table celled={true} className="record-list-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Questionnaire</Table.HeaderCell>
              <Table.HeaderCell>Conducted</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderArray(this.renderRecord, sortMeetingsByConducted(this.props.meetings, false))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

/*

            <Table.Row className="record" warning>
              <Table.Cell><Icon rotated="counterclockwise" name="dropdown" />29th of December 2017</Table.Cell>
              <Table.Cell>John Doe</Table.Cell>
              <Table.Cell>Incomplete <Hint text="This meeting was not finished. It will not be shown in the website until completed."/></Table.Cell>
              <Table.Cell>
                <Icon name="delete" />
                <Icon name="play" />
              </Table.Cell>
            </Table.Row>
            <Table.Row className="record stripe">
              <Table.Cell className="name"><Icon name="dropdown" />24th of December 2017</Table.Cell>
              <Table.Cell>Dan Reid</Table.Cell>
              <Table.Cell>The same day</Table.Cell>
              <Table.Cell />
            </Table.Row>
            {this.renderInner()}
            <Table.Row className="record">
              <Table.Cell className="name"><Icon rotated="counterclockwise" name="dropdown" />20th of December 2017</Table.Cell>
              <Table.Cell>Jane Doe</Table.Cell>
              <Table.Cell>2 days after</Table.Cell>
              <Table.Cell />
            </Table.Row>
            <Table.Row className="record stripe">
              <Table.Cell className="name"><Icon rotated="counterclockwise" name="dropdown" />19th of November 2017</Table.Cell>
              <Table.Cell>Jane Doe</Table.Cell>
              <Table.Cell>1 day after</Table.Cell>
              <Table.Cell />
            </Table.Row>
 */
export { RecordList };
