import * as React from "react";
import { IMeeting } from "models/meeting";
import { RadarData, IRadarSeries, IRadarPoint } from "models/radar";
import { Answer } from "models/answer";
import { RadarChart } from "components/RadarChart";
import { Aggregation } from "models/pref";
import moment from "moment";
import { Message, Icon } from "semantic-ui-react";
import {
  getMinQuestionValue,
  getMaxQuestionValue,
  getMinCategoryValue,
  getMaxCategoryValue,
} from "helpers/questionnaire";
import { useTranslation } from "react-i18next";

interface IProp {
  meetings: IMeeting[];
  aggregation: Aggregation;
}

interface ImplementationIProp {
  data?: RadarData;
  aggregation?: Aggregation;
}

export function MeetingRadarWithImpl<P extends ImplementationIProp>(
  RadarImpl: React.ComponentType<P>,
  innerProps?: P
): React.ComponentType<IProp> {
  const MeetingRadar = (p: IProp) => {
    const { t } = useTranslation();

    const getQuestionLevelData = (meetings: IMeeting[]): RadarData => {
      const series = meetings.map((meeting): IRadarSeries => {
        const answers = meeting.answers.reduce<IRadarPoint[]>(
          (answers: IRadarPoint[], answer: Answer): IRadarPoint[] => {
            const idx = meeting.outcomeSet.questions.findIndex(
              (q) => q.id === answer.questionID
            );
            if (idx === -1) {
              return answers;
            }
            const q = meeting.outcomeSet.questions[idx];
            if (q === undefined || q.archived) {
              return answers;
            }
            return answers.concat({
              axis: q.short || q.question,
              axisIndex: idx,
              value: answer.answer,
            });
          },
          []
        );
        return {
          name: new Date(meeting.date),
          datapoints: answers,
        };
      });
      return {
        series,
        scaleMax: getMaxQuestionValue(meetings[0].outcomeSet),
        scaleMin: getMinQuestionValue(meetings[0].outcomeSet),
      };
    };

    const getCategoryLevelData = (meetings: IMeeting[]): RadarData => {
      const series = meetings.map((meeting): IRadarSeries => {
        const answers = meeting.aggregates.category.map(
          (categoryAg): IRadarPoint => {
            let category = "Unknown Category";
            const idx = meeting.outcomeSet.categories.findIndex(
              (c) => c.id === categoryAg.categoryID
            );
            if (idx !== -1) {
              const cat = meeting.outcomeSet.categories[idx];
              if (cat !== undefined) {
                category = cat.name;
              }
            }
            return {
              axis: category,
              axisIndex: idx,
              value: categoryAg.value,
            };
          }
        );
        return {
          name: new Date(meeting.date),
          datapoints: answers,
        };
      });
      return {
        series,
        scaleMax: getMaxCategoryValue(meetings[0].outcomeSet),
        scaleMin: getMinCategoryValue(meetings[0].outcomeSet),
      };
    };

    const shouldSeriesBeDeactivated = (data: RadarData): boolean => {
      return data.series.length > 3;
    };

    const preProcessData = (data: RadarData): RadarData => {
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
        if (
          shouldSeriesBeDeactivated(data) &&
          i !== 0 &&
          i !== d.length - 1 &&
          i !== d.length - 2
        ) {
          x.disabled = true;
        }
        return x;
      });
      return data;
    };

    const renderInfoMessage = (data: RadarData): JSX.Element => {
      if (shouldSeriesBeDeactivated(data) === false) {
        return <span />;
      }
      return (
        <Message compact={true}>
          <Icon name="info" />{" "}
          {t(
            "By default, three records are shown on the radar chart. To view more, click the corresponding legend entries."
          )}
        </Message>
      );
    };

    if (!Array.isArray(p.meetings) || p.meetings.length === 0) {
      return <div />;
    }

    const data =
      p.aggregation === Aggregation.CATEGORY
        ? getCategoryLevelData(p.meetings)
        : getQuestionLevelData(p.meetings);

    return (
      <div className="meeting-radar">
        {renderInfoMessage(data)}
        <RadarImpl
          data={preProcessData(data)}
          aggregation={p.aggregation}
          {...innerProps}
        />
      </div>
    );
  };
  return MeetingRadar;
}

export const MeetingRadar = MeetingRadarWithImpl(RadarChart);
