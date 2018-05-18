import * as React from 'react';
import {Aggregation} from 'models/pref';
import {IMeeting} from 'models/meeting';
import {Answer} from 'models/answer';
import {ICategoryAggregate} from 'models/aggregates';
import {ImpactTable, IRow} from 'components/ImpactTable';
import {getHumanisedDate} from 'helpers/moment';
import {Select, DropdownItemProps, Message} from 'semantic-ui-react';
import './style.less';

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

interface IState {
  firstMeeting: IMeeting;
  secondMeeting: IMeeting;
}

class MeetingTable extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);

    this.onFirstMeetingSelectChange = this.onFirstMeetingSelectChange.bind(this);
    this.onSecondMeetingSelectChange = this.onSecondMeetingSelectChange.bind(this);
    this.getQuestionRows = this.getQuestionRows.bind(this);
    this.getCategoryRows = this.getCategoryRows.bind(this);
    this.getMeetingOptions = this.getMeetingOptions.bind(this);
    this.renderMeetingSelectionForm = this.renderMeetingSelectionForm.bind(this);
    this.renderTable = this.renderTable.bind(this);

    this.state = {
      firstMeeting: this.initialMeeting(props.meetings),
      secondMeeting: this.lastMeeting(props.meetings),
    };
  }

  public componentWillUpdate(nextProps) {
    const sortedIDs = (m: IMeeting[]): string[] => {
      return Array.from(m).map((m) => m.id).sort();
    };
    const oMeetings = sortedIDs(this.props.meetings);
    const nMeetings = sortedIDs(nextProps.meetings);
    if (oMeetings.length === nMeetings.length) {
      const same = oMeetings.reduce<boolean>((pv: boolean, cv: string, idx: number): boolean => {
        return cv === nMeetings[idx] && pv;
      }, true);
      if (same) {
        return;
      }
    }
    this.setState({
      firstMeeting: this.initialMeeting(nextProps.meetings),
      secondMeeting: this.lastMeeting(nextProps.meetings),
    });
  }

  private findMeeting(meetings: IMeeting[], comp: (fm: IMeeting, fc: number, sm: IMeeting, sc: number) => IMeeting): IMeeting|undefined {
    return meetings.reduce((last: IMeeting|undefined, m: IMeeting): IMeeting => {
      if (last === undefined) {
        return m;
      }
      const mConducted = Date.parse(m.conducted);
      const lConducted = Date.parse(last.conducted);
      return comp(m, mConducted, last, lConducted);
    }, undefined);
  }

  private initialMeeting(meetings: IMeeting[]): IMeeting|undefined {
    return this.findMeeting(meetings, (fm, fc, sm, sc) => {
      return (sc < fc) ? sm : fm;
    });
  }

  private lastMeeting(meetings: IMeeting[]): IMeeting|undefined {
    return this.findMeeting(meetings, (fm, fc, sm, sc) => {
      return (sc > fc) ? sm : fm;
    });
  }

  private getCategoryRows(): IRow[] {
    const f = this.state.firstMeeting;
    const l = this.state.secondMeeting;
    let rows = f.aggregates.category.reduce((rows: any, c: ICategoryAggregate) => {
      const category = f.outcomeSet.categories.find((x) => x.id === c.categoryID);
      rows[category.name] = {
        first: c.value,
        name: category.name,
      };
      return rows;
    }, {});
    rows = l.aggregates.category.reduce((rows: any, c: ICategoryAggregate) => {
      const category = l.outcomeSet.categories.find((x) => x.id === c.categoryID);
      if (rows[category.name] === undefined) {
        rows[category.name] = {
          name: category.name,
        };
      }
      rows[category.name] = { ...rows[category.name], last: c.value };
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  }

  private getQuestionRows(): IRow[] {
    const f = this.state.firstMeeting;
    const l = this.state.secondMeeting;
    let rows = f.answers.reduce((rows: any, a: Answer) => {
      const q = f.outcomeSet.questions.find((x) => x.id === a.questionID);
      if (q === undefined || q.archived) {
        return rows;
      }
      rows[q.question] = {
        first: a.answer,
        name: (q.short || q.question),
      };
      return rows;
    }, {});
    rows = l.answers.reduce((rows: any, a: Answer) => {
      const q = l.outcomeSet.questions.find((x) => x.id === a.questionID);
      if (q === undefined || q.archived) {
        return rows;
      }
      if (rows[q.question] === undefined) {
        rows[q.question] = {
          name: (q.short || q.question),
        };
      }
      rows[q.question] = { ...rows[q.question], last: a.answer };
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  }

  private getColumnTitle(prefix: string, meeting: IMeeting): string {
    return `${prefix} (${getHumanisedDate(new Date(meeting.conducted))})`;
  }

  private onFirstMeetingSelectChange(_, { value }): void {
    const { meetings } = this.props;

    this.setState((prevState) => ({
      ...prevState, firstMeeting: meetings.find((meeting) => meeting.id === value ),
    }));
  }

  private onSecondMeetingSelectChange(_, { value }): void {
    const { meetings } = this.props;

    this.setState((prevState) => ({
      ...prevState, secondMeeting: meetings.find((meeting) => meeting.id === value ),
    }));
  }

  private getMeetingOptions(): DropdownItemProps[] {
    const { meetings } = this.props;

    return Array.from(meetings).sort((a,b) => {
      return Date.parse(a.conducted) - Date.parse(b.conducted);
    }).map((meeting) => {
      return {
        value: meeting.id,
        key: meeting.id,
        text: getHumanisedDate(new Date(meeting.conducted)),
      };
    });
  }

  private renderMeetingSelectionForm(): JSX.Element {
    return (
      <div id="selectMeetingsContainer">
        <span>First meeting</span>
        <Select
          value={this.state.firstMeeting.id}
          onChange={this.onFirstMeetingSelectChange}
          options={this.getMeetingOptions()}
        />
        <span>Second meeting</span>
        <Select
          value={this.state.secondMeeting.id}
          onChange={this.onSecondMeetingSelectChange}
          options={this.getMeetingOptions()}
        />
      </div>
    );
  }

  private renderTable(): JSX.Element {
    const { aggregation } = this.props;

    const isCat = aggregation === Aggregation.CATEGORY;
    const rows = isCat ? this.getCategoryRows() : this.getQuestionRows();
    rows.sort((a, b) => a.name.localeCompare(b.name));

    const areMeetingsSame = this.state.firstMeeting.id === this.state.secondMeeting.id;

    return (
      <div>
        {areMeetingsSame && <Message info>You are currently comparing the same record.</Message>}
        <ImpactTable
          data={rows}
          nameColName={isCat ? 'Category' : 'Question'}
          firstColName={this.getColumnTitle('First meeting', this.state.firstMeeting)}
          lastColName={this.getColumnTitle('Second meeting', this.state.secondMeeting)}
        />
      </div>
    );
  }

  public render() {
    if (!Array.isArray(this.props.meetings) || this.props.meetings.length === 0) {
      return (<div />);
    }

    if (this.state.firstMeeting === undefined || this.state.secondMeeting === undefined) {
      return (<div />);
    }

    return (
      <div className="meeting-table">
        {this.renderMeetingSelectionForm()}
        {this.renderTable()}
      </div>
    );
  }
}

export {MeetingTable}
