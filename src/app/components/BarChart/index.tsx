import * as React from 'react';
import Chart from 'chart.js';
import color from 'chartjs-color';
import distinctColors from 'distinct-colors';
import {BarChartData} from 'models/bar';
import {precisionRound} from 'helpers/numbers';

let barCount = 0;

interface IProps {
  data: BarChartData;
  xAxisLabel: string;
  valueSuffixLabel?: string;
}

interface IState {
  err: boolean;
}

class BarChart extends React.Component<IProps, IState> {

  private canvasID: string;
  private graph;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `bar-${barCount++}`;
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
    const colours = distinctColors({count: data.series.length});
    const seriesStyler = (x, idx) => {
      const colour = color().rgb(colours[idx].rgba()).rgbString();
      return {
        label: x.label,
        data: x.data,
        backgroundColor: color(colour).alpha(0.2).rgbString(),
        borderColor: colour,
        borderWidth: 1,
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
    return new Chart(canvasElement, {
      type: 'horizontalBar',
      data: this.prepareDataset(p.data),
      options: {
        tooltips: {
          mode: 'point',
          callbacks: {
            label: (tooltipItem) => {
              return precisionRound(tooltipItem.xLabel,2) + (p.valueSuffixLabel || '');
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
            beginAtZero: true,
            scaleLabel: {
              display: true,
              labelString: p.xAxisLabel,
            },
            ticks: {
              callback: (value) => value + (p.valueSuffixLabel || ''),
            },
          }],
        },
      },
    });
  }

  public render() {
    return (
      <div className="bar">
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export {BarChart};
