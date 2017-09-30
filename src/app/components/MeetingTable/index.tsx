import * as React from 'react';
import {Aggregation} from 'models/pref';
import {IMeeting} from 'models/meeting';
import {Answer} from 'models/answer';
import {ICategoryAggregate} from 'models/aggregates';
import {ImpactTable, IRow} from 'components/ImpactTable';

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

class MeetingTable extends React.Component<IProp, any> {

  private firstMeeting(meetings: IMeeting[]): IMeeting {
    return meetings.reduce((first: IMeeting, m: IMeeting): IMeeting => {
      const fConducted = Date.parse(first.conducted);
      const mConducted = Date.parse(m.conducted);
      if (mConducted < fConducted) {
        return m;
      }
      return first;
    }, meetings[0]);
  }

  private lastMeeting(meetings: IMeeting[]): IMeeting {
    return meetings.reduce((last: IMeeting, m: IMeeting): IMeeting => {
      const fConducted = Date.parse(last.conducted);
      const mConducted = Date.parse(m.conducted);
      if (mConducted > fConducted) {
        return m;
      }
      return last;
    }, meetings[0]);
  }

  private getCategoryRows(p: IProp): IRow[] {
    const f = this.firstMeeting(p.meetings);
    const l = this.lastMeeting(p.meetings);
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
      rows[category.name] = Object.assign({}, rows[category.name], {
        last: c.value,
      });
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  }

  private getQuestionRows(p: IProp): IRow[] {
    const f = this.firstMeeting(p.meetings);
    const l = this.lastMeeting(p.meetings);
    let rows = f.answers.reduce((rows: any, a: Answer) => {
      const q = f.outcomeSet.questions.find((x) => x.id === a.questionID);
      rows[q.question] = {
        first: a.answer,
        name: q.question,
      };
      return rows;
    }, {});
    rows = l.answers.reduce((rows: any, a: Answer) => {
      const q = l.outcomeSet.questions.find((x) => x.id === a.questionID);
      if (rows[q.question] === undefined) {
        rows[q.question] = {
          name: q.question,
        };
      }
      rows[q.question] = Object.assign({}, rows[q.question], {
        last: a.answer,
      });
      return rows;
    }, rows);
    return Object.keys(rows).map((k) => rows[k]);
  }

  private renderTable(p: IProp): JSX.Element {
    const isCat = p.aggregation === Aggregation.CATEGORY;
    const rows = isCat ? this.getCategoryRows(p) : this.getQuestionRows(p);

    return (
      <ImpactTable
        data={rows}
        nameColName={isCat ? 'Category' : 'Question'}
      />
    );
  }

  public render() {
    if (!Array.isArray(this.props.meetings) || this.props.meetings.length === 0) {
      return (<div />);
    }

    return (
      <div className="meeting-table">
        {this.renderTable(this.props)}
      </div>
    );
  }
}

export {MeetingTable}
