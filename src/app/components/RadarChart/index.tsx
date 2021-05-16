import React from "react";
import { getConfig } from "./outcomeGraph";
import { RadarData, IRadarSeries, IRadarPoint } from "models/radar";
import { Aggregation } from "models/pref";
import { Message } from "semantic-ui-react";
import { Chart } from "components/Chart";
import { useTranslation } from "react-i18next";
import "./style.less";

interface IProp {
  data?: RadarData;
  aggregation?: Aggregation;
}

export interface IOutcomeGraphPoint {
  outcome: string;
  value: number;
  notes?: string;
}

export interface IOutcomeGraphSeries {
  timestamp: string;
  notes?: string;
  disabled?: boolean;
  outcomes: IOutcomeGraphPoint[];
}

function getAxisTitle(original: string): string {
  if (original.length > 40) {
    return original.substring(0, 40) + "...";
  }
  return original;
}

export type OutcomeGraphData = IOutcomeGraphSeries[];

const RadarChart = (p: IProp): JSX.Element => {
  const { t } = useTranslation();

  const convertData = (data: IRadarSeries[]): OutcomeGraphData => {
    return data.map((s: IRadarSeries): IOutcomeGraphSeries => {
      return {
        notes: s.note,
        timestamp: s.name instanceof Date ? s.name.toISOString() : s.name,
        disabled: s.disabled,
        outcomes: s.datapoints
          .sort((a, b) => {
            return a.axisIndex - b.axisIndex;
          })
          .map((d: IRadarPoint): IOutcomeGraphPoint => {
            return {
              notes: d.note,
              value: d.value,
              outcome: getAxisTitle(d.axis),
            };
          }),
      };
    });
  };

  const getNumberOfAxis = (data: IRadarSeries[]): number => {
    return data.reduce((maxAxis, series) => {
      if (series.datapoints.length > maxAxis) {
        return series.datapoints.length;
      }
      return maxAxis;
    }, 0);
  };

  const renderError = (): JSX.Element => {
    let dims = t("dimensions");
    if (p.aggregation === Aggregation.QUESTION) {
      dims = t("questions");
    }
    if (p.aggregation === Aggregation.CATEGORY) {
      dims = t("categories");
    }
    return (
      <Message info={true}>
        <Message.Header>{t("Incompatible Visualisation")}</Message.Header>
        <Message.Content>
          {t(
            "The questionnaire contains less than three {dimensionName}, and as such, cannot be visualised as a radar chart. Please select a different visualisation or aggregation.",
            { dimensionName: dims }
          )}
        </Message.Content>
      </Message>
    );
  };

  if (Array.isArray(p.data.series) === false) {
    return <div />;
  }

  const wrapper = (inner: JSX.Element): JSX.Element => {
    return <div className="radar">{inner}</div>;
  };

  const noAxis = getNumberOfAxis(p.data.series);
  if (noAxis < 3) {
    return wrapper(renderError());
  }

  return wrapper(
    <Chart
      config={getConfig(
        convertData(p.data.series),
        p.data.scaleMin,
        p.data.scaleMax
      )}
      style={{ fillAlpha: 0.2 }}
    />
  );
};

export { RadarChart };
