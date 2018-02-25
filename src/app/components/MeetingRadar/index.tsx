import * as React from 'react';
import {IMeeting} from 'models/meeting';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Answer} from 'models/answer';
import {RadarChart} from 'components/RadarChart';
import {Aggregation} from 'models/pref';
import {getMinQuestionValue, getMaxQuestionValue, getMinCategoryValue, getMaxCategoryValue} from 'helpers/questionnaire';

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

class MeetingRadar extends React.Component<IProp, any> {

  private getQuestionLevelData(meetings: IMeeting[]): RadarData {
    const series = meetings.map((meeting): IRadarSeries => {
      const answers = meeting.answers.reduce<IRadarPoint[]>((answers: IRadarPoint[], answer: Answer): IRadarPoint[] => {
        const q = meeting.outcomeSet.questions.find((q) => q.id === answer.questionID);
        if (q === undefined || q.archived) {
          return answers;
        }
        return answers.concat({
          axis: q.question,
          value: answer.answer,
        });
      }, []);
      return {
        name: new Date(meeting.conducted),
        datapoints: answers,
      };
    });
    return {
      series,
      scaleMax: getMaxQuestionValue(meetings[0].outcomeSet),
      scaleMin: getMinQuestionValue(meetings[0].outcomeSet),
    };
  }

  private getCategoryLevelData(meetings: IMeeting[]): RadarData {
    const series = meetings.map((meeting): IRadarSeries => {
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
    return {
      series,
      scaleMax: getMaxCategoryValue(meetings[0].outcomeSet),
      scaleMin: getMinCategoryValue(meetings[0].outcomeSet),
    };
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
