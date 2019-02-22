import * as React from 'react';
import * as Chart from 'chart.js';
import * as color from 'chartjs-color';
import {BarChartData} from 'models/bar';
import {precisionRound} from 'helpers/numbers';

let barCount = 0;

interface IProps {
  data: BarChartData;
  showPercentage?: boolean;
  xAxisLabel: string;
}

interface IState {
  err: boolean;
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

class StackedBarChart extends React.Component<IProps, IState> {

  private canvasID: string;
  private graph;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `stacked-bar-${barCount++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  private renderDOM() {
    if (this.props.data === undefined || this.props.data.series.length === 0) {
      return;
    }
    if(this.graph !== undefined) {
      this.graph.destroy();
      this.graph = undefined;
    }

    this.graph = this.drawChart(this.canvasID, this.props);
  }

  private prepareDataset(data: BarChartData): any {
    const start = 15;
    const end = 85;
    const step = (end-start) / data.series.length;
    const seriesStyler = (x, idx) => {
      return {
        label: x.label,
        data: x.data,
        backgroundColor: color().hsl(308, 22.5, start + (idx*step)).alpha(0.8).rgbString(),
        borderColor: color().hsl(308, 22.5, start + (idx*step) - 10).rgbString(),
        borderWidth: 1,
        borderSkipped: 'left',
        fill: true,
      };
    };
    return {
      datasets: data.series.map(seriesStyler),
      labels: data.labels,
    };
  }

  private drawChart(canvasID: string, p: IProps) {
    const canvasElement = (document.getElementById(canvasID) as HTMLCanvasElement).getContext('2d');
    if (canvasElement === null) {
      throw new Error('The canvas element specified does not exist!');
    }
    const maxX = maxXValue(this.props.data);
    console.log(maxX);
    return new Chart(canvasElement, {
      type: 'horizontalBar',
      data: this.prepareDataset(p.data),
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
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
              max: this.props.showPercentage ? maxX : undefined,
              callback: (value) => {
                if (!this.props.showPercentage) {
                  return value;
                } else {
                  return `${precisionRound((value / maxX)*100, 2)}%`;
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
      <div className="stacked-bar">
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export {StackedBarChart};
