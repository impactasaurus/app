import * as React from "react";
import { IMeeting } from "models/meeting";
import { GraphData, IGraphSeries, IGraphDataPoint } from "models/graph";
import { Answer } from "models/answer";
import { Graph } from "components/Graph";
import { Aggregation } from "models/pref";
import {
  getMinQuestionValue,
  getMaxQuestionValue,
  getMinCategoryValue,
  getMaxCategoryValue,
} from "helpers/questionnaire";

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

interface ISeriesToDataMap {
  [series: string]: IGraphDataPoint[];
}

const combineGraphSeries = (series: IGraphSeries[]): IGraphSeries[] => {
  const seriesMap = series.reduce(
    (m: ISeriesToDataMap, d: IGraphSeries): ISeriesToDataMap => {
      if (m[d.label] === undefined) {
        m[d.label] = [];
      }
      m[d.label].push(...d.data);
      return m;
    },
    {}
  );
  const result: IGraphSeries[] = [];
  for (const series in seriesMap) {
    if (Object.prototype.hasOwnProperty.call(seriesMap, series)) {
      result.push({
        label: series,
        data: seriesMap[series],
      });
    }
  }
  return result;
};

const getQuestionLevelData = (meetings: IMeeting[]): GraphData => {
  const seriesPerDP = meetings.reduce(
    (prevData: IGraphSeries[], meeting): IGraphSeries[] => {
      const series = meeting.answers.reduce<IGraphSeries[]>(
        (series: IGraphSeries[], answer: Answer): IGraphSeries[] => {
          const q = meeting.outcomeSet.questions.find(
            (q) => q.id === answer.questionID
          );
          if (q === undefined || q.archived) {
            return series;
          }
          return series.concat({
            label: q.short || q.question,
            data: [
              {
                x: new Date(meeting.completed),
                y: answer.answer,
              },
            ],
          });
        },
        []
      );
      return prevData.concat(series);
    },
    []
  );
  return {
    series: combineGraphSeries(seriesPerDP),
    scaleMax: getMaxQuestionValue(meetings[0].outcomeSet),
    scaleMin: getMinQuestionValue(meetings[0].outcomeSet),
  };
};

const getCategoryLevelData = (meetings: IMeeting[]): GraphData => {
  const seriesPerDP = meetings.reduce(
    (prevData: IGraphSeries[], meeting): IGraphSeries[] => {
      return prevData.concat(
        meeting.aggregates.category.map((categoryAg): IGraphSeries => {
          let category = "Unknown Category";
          const cat = meeting.outcomeSet.categories.find(
            (c) => c.id === categoryAg.categoryID
          );
          if (cat !== undefined) {
            category = cat.name;
          }
          return {
            label: category,
            data: [
              {
                x: new Date(meeting.completed),
                y: categoryAg.value,
              },
            ],
          };
        })
      );
    },
    []
  );
  return {
    series: combineGraphSeries(seriesPerDP),
    scaleMax: getMaxCategoryValue(meetings[0].outcomeSet),
    scaleMin: getMinCategoryValue(meetings[0].outcomeSet),
  };
};

const MeetingGraph = (props: IProp): JSX.Element => {
  const { meetings, aggregation } = props;

  if (!Array.isArray(meetings) || meetings.length === 0) {
    return <div />;
  }

  const data =
    aggregation === Aggregation.CATEGORY
      ? getCategoryLevelData(meetings)
      : getQuestionLevelData(meetings);

  return (
    <div className="meeting-graph">
      <Graph data={data} />
    </div>
  );
};

export { MeetingGraph };
