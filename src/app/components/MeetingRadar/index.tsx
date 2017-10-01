import * as React from 'react';
import {IMeeting} from 'models/meeting';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Answer} from 'models/answer';
import {RadarChart} from 'components/RadarChart';
import {Aggregation} from 'models/pref';

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

class MeetingRadar extends React.Component<IProp, any> {

  private getQuestionLevelData(meetings: IMeeting[]): RadarData {
    return meetings.map((meeting): IRadarSeries => {
      const answers = meeting.answers.map((answer: Answer): IRadarPoint => {
        const q = meeting.outcomeSet.questions.find((q) => q.id === answer.questionID);
        let question = 'Unknown Question';
        if (q !== undefined) {
          if (q.archived) {
            question = `${q.question} (archived)`;
          } else {
            question = q.question;
          }
        }
        return {
          axis: question,
          value: answer.answer,
        };
      });
      return {
        name: new Date(meeting.conducted),
        datapoints: answers,
      };
    });
  }

  private getCategoryLevelData(meetings: IMeeting[]): RadarData {
    return meetings.map((meeting): IRadarSeries => {
      const answers = meeting.aggregates.category.map((categoryAg): IRadarPoint => {
        let category = 'Unknown Category';
        const cat = meeting.outcomeSet.categories.find((c) => c.id === categoryAg.categoryID);
        if (cat !== undefined) {
          category = cat.name;
        }
        return {
          axis: category,
          value: categoryAg.value,
        };
      });
      return {
        name: new Date(meeting.conducted),
        datapoints: answers,
      };
    });
  }

  public render() {
    if (!Array.isArray(this.props.meetings) || this.props.meetings.length === 0) {
      return (<div />);
    }

    const data = this.props.aggregation === Aggregation.CATEGORY ?
      this.getCategoryLevelData(this.props.meetings) :
      this.getQuestionLevelData(this.props.meetings);

    return (
      <div className="meeting-radar">
        <RadarChart data={data} />
      </div>
    );
  }
}

export { MeetingRadar }
