import React from "react";
import { Chart } from "components/Chart";
import { SeriesType } from "theme/chartStyle";
import {
  Card,
  Icon,
  Message,
  Responsive,
  SemanticWIDTHS,
} from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import "./style.less";

export interface IAnswerDistributionSeries {
  name: string;
  values: number[];
}

export interface IAnswerDistribution {
  id: string;
  name: string;
  min: number;
  max: number;
  series: IAnswerDistributionSeries[];
}

export interface IProp {
  data: IAnswerDistribution[];
}

const prepareDataset = (data: IAnswerDistribution): any => {
  const seriesStyler = (x: IAnswerDistributionSeries) => ({
    label: x.name,
    data: x.values.reduce((arr, v) => {
      const index = Math.round(v) - data.min;
      if (!arr[index]) {
        arr[index] = 1;
      } else {
        arr[index]++;
      }
      return arr;
    }, []),
    borderWidth: 1,
    fill: true,
  });
  const labels: string[] = [];
  for (let index = data.min; index <= data.max; index++) {
    labels.push(index.toString());
  }
  return {
    datasets: data.series.map(seriesStyler),
    labels: labels,
  };
};

const chartConfig = (data: IAnswerDistribution) => {
  return {
    type: "bar",
    data: prepareDataset(data),
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              stepSize: 1,
              beginAtZero: true,
            },
          },
        ],
      },
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
    },
  };
};

const roundingWillOccur = (data: IAnswerDistribution[]): boolean => {
  const willRound = (v: number) => v % 1 !== 0;
  const roundingReducer = function <T>(
    arr: T[],
    roundingChecker: (v: T) => boolean
  ) {
    return arr.reduce((rounded, v) => {
      return rounded || roundingChecker(v);
    }, false);
  };
  return roundingReducer(data, (d) =>
    roundingReducer(d.series, (s) => roundingReducer(s.values, willRound))
  );
};

const graphGrid = (cols: SemanticWIDTHS, p: IProp): JSX.Element => {
  return (
    <Card.Group itemsPerRow={cols}>
      {p.data.map((d) => (
        <Card key={d.id}>
          <Card.Content>
            <Card.Description>
              <h4>{d.name}</h4>
              <Chart
                config={chartConfig(d)}
                style={{ fillAlpha: 0.8, seriesType: SeriesType.INDEPENDENT }}
              />
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export const AnswerDistributionChart = (p: IProp): JSX.Element => {
  const { t } = useTranslation();

  if (p.data.length === 0) {
    return <div />;
  }

  const wrapper = (inner: JSX.Element) => (
    <div className="answer-distribution-report">
      {roundingWillOccur(p.data) && (
        <Message compact={true}>
          <Icon name="info" />{" "}
          {t(
            "Fractional numbers, which are a result of category aggregation, are rounded to the nearest whole number"
          )}
        </Message>
      )}
      {inner}
    </div>
  );

  if (p.data.length === 1) {
    return wrapper(graphGrid(1, p));
  }
  return wrapper(
    <>
      <Responsive minWidth={990}>{graphGrid(2, p)}</Responsive>
      <Responsive maxWidth={989}>{graphGrid(1, p)}</Responsive>
    </>
  );
};
