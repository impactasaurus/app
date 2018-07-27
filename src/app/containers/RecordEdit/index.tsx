import * as React from 'react';
import { Helmet } from 'react-helmet';
import {Button, Loader, Grid, ButtonProps, Label} from 'semantic-ui-react';
import {IURLConnector, setURL} from 'redux/modules/url';
import {
  editMeetingDate, editMeetingTags, getMeeting, IEditMeetingDate, IEditMeetingTags,
  IMeetingResult,
} from 'apollo/modules/meetings';
import {RecordTagInputWithSuggestions} from 'components/RecordTagInputWithSuggestions';
import {DateTimePicker} from 'components/DateTimePicker';
import {Hint} from 'components/Hint';
import * as moment from 'moment';
import {bindActionCreators} from 'redux';
import {renderArray} from 'helpers/react';
import './style.less';
const strings = require('./../../../strings.json');
const { connect } = require('react-redux');

interface IProps extends IURLConnector, IEditMeetingDate, IEditMeetingTags {
  match: {
    params: {
      id: string,
    },
  };
  location: {
    // can provide a ?next=relativeURL which the user will be taken to on cancel or successful save
    search: string,
  };
  data: IMeetingResult;
}

interface IState {
  saveError?: string;
  conducted?: moment.Moment;
  tags?: string[];
  saving?: boolean;
  tagEditing?: boolean;
  dateEditing?: boolean;
}

function getNextPageURL(p: IProps): string|undefined {
  const urlParams = new URLSearchParams(p.location.search);
  if (urlParams.has('next') === false) {
    return undefined;
  }
  return urlParams.get('next');
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class RecordEditInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.saveRecord = this.saveRecord.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setConductedDate = this.setConductedDate.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.loadState = this.loadState.bind(this);
    this.renderTagSection = this.renderTagSection.bind(this);
    this.renderDateSection = this.renderDateSection.bind(this);
  }

  public componentWillMount() {
    if (this.props.data.getMeeting !== undefined) {
      this.loadState(this.props);
    }
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.data.getMeeting !== undefined && this.props.data.getMeeting === undefined) {
      this.loadState(nextProps);
    }
  }

  private loadState(p: IProps) {
    this.setState({
      conducted: moment(p.data.getMeeting.conducted),
      tags: p.data.getMeeting.tags,
    });
  }

  private saveRecord() {
    const record = this.props.data.getMeeting;
    const {conducted, tags} = this.state;
    this.setState({
      saving: true,
      saveError: undefined,
    });

    let p = Promise.resolve(record);

    if (!this.state.conducted.isSame(record.conducted)) {
      p = p.then(() => {
        return this.props.editMeetingDate(record.id, conducted.toDate());
      });
    }

    const newTags = JSON.stringify(Array.from(tags).sort());
    const oldTags = JSON.stringify(Array.from(record.tags).sort());
    if (newTags !== oldTags) {
      p = p.then(() => {
        return this.props.editMeetingTags(record.id, tags);
      });
    }

    return p
      .then(() => {
        this.nextPage();
      })
      .catch((e) => {
        this.setState({
          saving: false,
          saveError: e,
        });
      });
  }

  private nextPage() {
    const nextPage = getNextPageURL(this.props);
    if (nextPage !== undefined) {
      this.props.setURL(nextPage);
      return;
    }
    const record = this.props.data.getMeeting;
    if (record !== undefined) {
      this.props.setURL(`/beneficiary/${record.beneficiary}`);
      return;
    }
    this.props.setURL('/');
  }

  private setConductedDate(date: moment.Moment) {
    this.setState({
      conducted: date,
    });
  }

  private setTags(tags: string[]): void {
    this.setState({
      tags,
    });
  }

  private renderEditButton(onClick: ()=>void): JSX.Element {
    return (<Button className="field-edit" onClick={onClick} compact={true} size="tiny" primary={true}>Edit</Button>);
  }

  private renderDateSection(dateEditing: boolean): JSX.Element {
    let control = (<div />);
    if (dateEditing) {
      control = (<DateTimePicker moment={this.state.conducted} onChange={this.setConductedDate} allowFutureDates={false} />);
    } else {
      const dateEdit = () => {
        this.setState({dateEditing: true});
      };
      control = this.renderEditButton(dateEdit);
    }
    return (
      <div>
        <h4 className="label inline">Date Conducted</h4>
        <span className="conductedDate">{this.state.conducted.format('llll')}</span>
        {control}
      </div>
    );
  }

  private renderTagSection(beneficiary: string, tagEditing: boolean): JSX.Element {
    let tags = (<div />);
    if (tagEditing) {
      tags = (
        <RecordTagInputWithSuggestions
          onChange={this.setTags}
          tags={this.state.tags}
          beneficiary={beneficiary}
        />
      );
    } else {
      const tagEdit = () => {
        this.setState({tagEditing: true});
      };
      const editButton = this.renderEditButton(tagEdit);
      if (this.state.tags.length > 0) {
        tags = (
          <div>
            {renderArray((t) => (<Label>{t}</Label>), this.state.tags)}
            {editButton}
          </div>
        );
      } else {
        tags = (
          <span>
            <span>No tags</span>
            {editButton}
          </span>
        );
      }
    }
    return (
      <div>
        <h4 className="label inline optional"><Hint text={strings.tagExplanation} />Tags</h4>
        {tags}
      </div>
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container={true} columns={1} id="record-edit">
          <Grid.Column>
            <Helmet>
              <title>Edit Record</title>
            </Helmet>
            <div id="record-edit">
              <h1>Edit Record</h1>
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };

    if(this.props.match.params.id === undefined) {
      return wrapper(<div />);
    }

    const record = this.props.data.getMeeting;
    if(record === undefined) {
      return wrapper(<Loader active={true} inline="centered" />);
    }

    const startProps: ButtonProps = {};
    if (this.state.saving) {
      startProps.loading = true;
      startProps.disabled = true;
    }

    return wrapper((
      <div className="impactform">
        <div>
          <h4 className="label inline">Beneficiary ID</h4>
          <span>{record.beneficiary}</span>
        </div>
        <div>
          <h4 className="label inline">Questionnaire</h4>
          <span>{record.outcomeSet.name}</span>
        </div>
        <div>
          <h4 className="label inline">Facilitator</h4>
          <span>{record.user}</span>
        </div>
        {this.renderTagSection(record.beneficiary, this.state.tagEditing)}
        {this.renderDateSection(this.state.dateEditing)}
        <div>
          <div className="button-group">
            <Button className="cancel" onClick={this.nextPage}>Cancel</Button>
            <Button {...startProps} className="submit" onClick={this.saveRecord}>Save</Button>
          </div>
          <p>{this.state.saveError}</p>
        </div>
      </div>
    ));
  }
}

const RecordEdit = editMeetingTags<IProps>(editMeetingDate<IProps>(getMeeting<IProps>((props) => props.match.params.id)(RecordEditInner)));
export { RecordEdit };
