import * as React from 'react';
import {IMeeting} from 'models/meeting';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Answer} from 'models/answer';
import {RadarChart} from 'components/RadarChart';
import {Aggregation} from 'models/pref';
import * as moment from 'moment';
import {Message, Icon} from 'semantic-ui-react';
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
          axis: (q.short || q.question),
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

  private shouldSeriesBeDeactivated(data: RadarData): boolean {
    return data.series.length > 3;
  }

  private preProcessData(data: RadarData): RadarData {
    data.series = data.series.sort((a, b): number => {
      const aMom = moment(a.name);
      const bMom = moment(b.name);
      if (aMom.isValid() && bMom.isValid()) {
        return aMom.diff(bMom);
      }
      // should never happen, in MeetingRadar we are always comparing dated series
      return 0;
    });
    data.series = data.series.map((x, i, d) => {
      // get first and two most recent
      // gives idea of total journey and recent journey
      if (this.shouldSeriesBeDeactivated(data) && i !== 0 && i !== d.length-1 && i !== d.length-2) {
        x.disabled = true;
      }
      return x;
    });
    return data;
  }

  private renderInfoMessage(data: RadarData): JSX.Element {
    if (this.shouldSeriesBeDeactivated(data) === false) {
      return (<span />);
    }
    return (
      <Message compact={true}>
        <Icon name="info" /> By default, three records are shown on the radar chart. To view more, click the corresponding legend entries.
      </Message>
    );
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
        {this.renderInfoMessage(data)}
        <RadarChart data={this.preProcessData(data)} />
      </div>
    );
  }
}

export { MeetingRadar };
