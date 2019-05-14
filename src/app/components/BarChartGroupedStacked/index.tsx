import * as React from 'react';
import * as Chart from 'chart.js';
import * as color from 'chartjs-color';
import {precisionRound} from 'helpers/numbers';

export interface IGroupedBarChartSeries {
  label: string;
  before: number[];
  after: number[];
}

export interface IGroupedBarChartData {
  labels: string[];
  series: IGroupedBarChartSeries[];
}

let groupedStackedBarCount = 0;

interface IProps {
  data: IGroupedBarChartData;
  showPercentage?: boolean;
  xAxisLabel: string;
}

interface IState {
  err: boolean;
}

const maxXValue = (d: IGroupedBarChartData): number => {
  const sums: number[] = [];
  const add = (dp, i) => {
    if (sums[i] === undefined) {
      sums[i] = dp;
    } else {
      sums[i] += dp;
    }
  };
  d.series.forEach((s) => {
    s.before.forEach(add);
    s.after.forEach(add);
  });
  return Math.max(...sums);
};

class GroupedStackedBarChart extends React.Component<IProps, IState> {

  private canvasID: string;
  private graph;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `grouped-stacked-bar-${groupedStackedBarCount++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  private renderDOM() {
    if (this.props.data === undefined ||
      this.props.data.series.length === 0) {
      return;
    }
    if(this.graph !== undefined) {
      this.graph.destroy();
      this.graph = undefined;
    }

    this.graph = this.drawChart(this.canvasID, this.props);
  }

  private prepareDataset(data: IGroupedBarChartData): any {
    const start = 15;
    const end = 85;
    const step = (end-start) / data.series.length;
    const seriesStyler = (out, x: IGroupedBarChartSeries, idx) => {
      const base = {
        label: x.label,
        backgroundColor: color().hsl(308, 22.5, start + (idx*step)).alpha(0.8).rgbString(),
        borderColor: color().hsl(308, 22.5, start + (idx*step) - 10).rgbString(),
        borderWidth: 1,
        borderSkipped: 'left',
        fill: true,
      };
      out.push({
        ...base,
        data: x.before,
        stack: 'before',
      });
      out.push({
        ...base,
        data: x.after,
        stack: 'after',
      });
      return out;
    };
    return {
      datasets: data.series.reduce(seriesStyler, []),
      labels: data.labels,
    };
  }

  private drawChart(canvasID: string, p: IProps) {
    const canvasElement = (document.getElementById(canvasID) as HTMLCanvasElement).getContext('2d');
    if (canvasElement === null) {
      throw new Error('The canvas element specified does not exist!');
    }
    const maxX = maxXValue(this.props.data);
    return new Chart(canvasElement, {
      type: 'horizontalBar',
      data: this.prepareDataset(p.data),
      options: {
        tooltips: {
          mode: 'y',
          intersect: false,
          callbacks: {
            title: (items) => {
              const isBefore = items.reduce((m, i) => {
                return m || i.datasetIndex === 0;
              }, false);
              if (isBefore) {
                return 'Before';
              }
              return 'After';
            },
          },

        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: p.xAxisLabel,
            },
            ticks: {
              beginAtZero: true,
              max: this.props.showPercentage ? maxX/2 : undefined,
              callback: (value) => {
                if (!this.props.showPercentage) {
                  return value;
                } else {
                  return `${precisionRound((value / (maxX/2))*100, 2)}%`;
                }
              },
            },
          }],
          yAxes: [{
            stacked: true,
          }],
        },
      },
    });
  }

  public render() {
    return (
      <div className="grouped-stacked-bar">
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export {GroupedStackedBarChart};
