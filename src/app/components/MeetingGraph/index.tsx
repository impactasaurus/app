import * as React from 'react';
import {IMeeting} from 'models/meeting';
import {GraphData, IGraphSeries, IGraphDataPoint} from 'models/graph';
import {Answer} from 'models/answer';
import {Graph} from 'components/Graph';
import {Aggregation} from 'models/pref';
import {getMinQuestionValue, getMaxQuestionValue, getMinCategoryValue, getMaxCategoryValue} from 'helpers/questionnaire';

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

interface ISeriesToDataMap {
  [series: string]: IGraphDataPoint[];
}

class MeetingGraph extends React.Component<IProp, any> {

  private combineGraphSeries(series: IGraphSeries[]): IGraphSeries[] {
    const seriesMap = series.reduce((m: ISeriesToDataMap, d: IGraphSeries): ISeriesToDataMap => {
      if (m[d.label] === undefined) {
        m[d.label] = [];
      }
      m[d.label].push(...d.data);
      return m;
    }, {});
    const result: IGraphSeries[] = [];
    for (const series in seriesMap) {
      if (seriesMap.hasOwnProperty(series)) {
        result.push({
          label: series,
          data: seriesMap[series],
        });
      }
    }
    return result;
  }

  private getQuestionLevelData(meetings: IMeeting[]): GraphData {
    const seriesPerDP =  meetings.reduce((prevData: IGraphSeries[], meeting): IGraphSeries[] => {
      return prevData.concat(meeting.answers.map((answer: Answer): IGraphSeries => {
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
          label: question,
          data: [{
            x: new Date(meeting.conducted),
            y: answer.answer,
          }],
        };
      }));
    }, []);
    return {
      series: this.combineGraphSeries(seriesPerDP),
      scaleMax: getMaxQuestionValue(meetings[0].outcomeSet),
      scaleMin: getMinQuestionValue(meetings[0].outcomeSet),
    };
  }

  private getCategoryLevelData(meetings: IMeeting[]): GraphData {
    const seriesPerDP = meetings.reduce((prevData: IGraphSeries[] , meeting): IGraphSeries[]  => {
      return prevData.concat(meeting.aggregates.category.map((categoryAg): IGraphSeries => {
        let category = 'Unknown Category';
        const cat = meeting.outcomeSet.categories.find((c) => c.id === categoryAg.categoryID);
        if (cat !== undefined) {
          category = cat.name;
        }
        return {
          label: category,
          data: [{
            x: new Date(meeting.conducted),
            y: categoryAg.value,
          }],
        };
      }));
    }, []);
    return {
      series: this.combineGraphSeries(seriesPerDP),
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
      <div className="meeting-graph">
        <Graph data={data} />
      </div>
    );
  }
}

export { MeetingGraph }
