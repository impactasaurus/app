import * as React from "react";
import { BarChartData } from "models/bar";
import { precisionRound } from "helpers/numbers";
import { Chart } from "components/Chart";
import { SeriesType } from "theme/chartStyle";

interface IProps {
  data: BarChartData;
  showPercentage?: boolean;
  xAxisLabel: string;
}

const maxXValue = (d: BarChartData): number => {
  const sums: number[] = [];
  d.series.forEach((s) => {
    s.data.forEach((dp, i) => {
      if (sums[i] === undefined) {
        sums[i] = dp;
      } else {
        sums[i] += dp;
      }
    });
  });
  return Math.max(...sums);
};

function getAxisTitle(original: string): string {
  if (original.length > 60) {
    return original.substring(0, 60) + "...";
  }
  return original;
}

const prepareDataset = (data: BarChartData): any => {
  const seriesStyler = (x) => {
    return {
      label: x.label,
      data: x.data,
      borderWidth: 1,
      borderSkipped: "left",
      fill: true,
    };
  };
  return {
    datasets: data.series.map(seriesStyler),
    labels: data.labels.map(getAxisTitle),
  };
};

const chartConfig = (p: IProps) => {
  const maxX = maxXValue(p.data);
  return {
    type: "horizontalBar",
    data: prepareDataset(p.data),
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: p.xAxisLabel,
            },
            ticks: {
              beginAtZero: true,
              max: maxX,
              stepSize: p.showPercentage ? maxX / 5 : undefined,
              callback: (value) => {
                if (!p.showPercentage) {
                  return value;
                } else {
                  return `${precisionRound((value / maxX) * 100, 0)}%`;
                }
              },
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
    },
  };
};

class StackedBarChart extends React.Component<IProps, any> {
  public render() {
    if (this.props.data === undefined || this.props.data.series.length === 0) {
      return <div />;
    }

    return (
      <div className="stacked-bar">
        <Chart
          config={chartConfig(this.props)}
          style={{ fillAlpha: 0.8, seriesType: SeriesType.SCALE }}
        />
      </div>
    );
  }
}

export { StackedBarChart };
