import React from "react";
import { Chart } from "components/Chart";
import { SeriesType } from "theme/chartStyle";
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
  selectLabel: string;
}

const prepareDataset = (data: IAnswerDistribution): any => {
  const seriesStyler = (x: IAnswerDistributionSeries) => {
    console.log(x.values);
    return {
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
      borderSkipped: "left",
      fill: true,
    };
  };
  const labels: string[] = [];
  for (let index = data.min; index <= data.max; index++) {
    // TODO: use the likert labels if available alongside the values
    labels.push("" + index);
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

export const AnswerDistributionChart = (p: IProp): JSX.Element => {
  if (p.data.length === 0) {
    return <div />;
  }

  // TODO: Explain that categories values are rounded
  // TODO: Style charts and their layout
  return (
    <div className="answer-distribution-report">
      {p.data.map((d) => (
        <Chart
          key={d.id}
          config={chartConfig(d)}
          style={{ fillAlpha: 0.8, seriesType: SeriesType.INDEPENDENT }}
        />
      ))}
    </div>
  );
};
