import * as React from 'react';
import {setMeetingNotes, ISetMeetingNotes} from 'apollo/modules/meetings';
import 'rc-slider/assets/index.css';
import { Button, ButtonProps} from 'semantic-ui-react';
import {Notepad} from 'components/Notepad';
import {IMeeting} from 'models/meeting';
import {isNullOrUndefined} from 'util';
import './style.less';
const ReactGA = require('react-ga');

interface IProps extends ISetMeetingNotes {
  record: IMeeting;
  onBack: () => void;
  onComplete: () => void;
}

interface IState {
  saving?: boolean;
  savingError?: string;
  notes?: string;
}

class MeetingNotepadInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    let notes: string;
    if (this.props.record !== undefined && this.props.record.notes !== undefined) {
      notes = this.props.record.notes;
    }
    this.state = {
      saving: false,
      notes,
    };
    this.saveNotes = this.saveNotes.bind(this);
    this.setNotes = this.setNotes.bind(this);
  }

  public componentWillUpdate(nextProps: IProps) {
    const recordBeenSet = this.props.record === undefined && nextProps.record !== undefined;
    const newRecord = this.props.record !== undefined && nextProps.record !== undefined && this.props.record.id !== nextProps.record.id;
    if (recordBeenSet || newRecord) {
      this.setState({
        notes: nextProps.record.notes,
      });
    }
  }

  private setNotes(notes: string) {
    this.setState({
      notes,
    });
  }

  private saveNotes() {
    const notesNotChanged = this.props.record.notes === this.state.notes;
    const bothEmpty = isNullOrUndefined(this.props.record.notes) && isNullOrUndefined(this.state.notes);
    if (notesNotChanged || bothEmpty) {
      return this.props.onComplete();
    }
    this.setState({
      saving: true,
      savingError: undefined,
    });
    this.props.setMeetingNotes(this.props.record.id, this.state.notes)
      .then(() => {
        ReactGA.event({
          category : 'assessment',
          label : 'notes',
          action: 'provided',
        });
        this.props.onComplete();
      })
      .catch((e) => {
        this.setState({
          saving: false,
          savingError: e,
        });
      });
  }

  public render() {
    const placeholder = 'Record any additional comments, goals or actions';
    const nextProps: ButtonProps = {};
    if (this.state.saving) {
      nextProps.loading = true;
      nextProps.disabled = true;
    }
    return (
      <div className="meeting-notepad">
        <h1>Additional Comments</h1>
        <Notepad onChange={this.setNotes} notes={this.state.notes} collapsible={false} placeholder={placeholder}/>
        <Button onClick={this.props.onBack}>Back</Button>
        <Button {...nextProps} onClick={this.saveNotes}>Next</Button>
        <p>{this.state.savingError}</p>
      </div>);
  }
}
const MeetingNotepad = setMeetingNotes<IProps>(MeetingNotepadInner);
export { MeetingNotepad }
