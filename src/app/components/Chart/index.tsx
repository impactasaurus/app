import * as React from 'react';
import {Chart as ChartJS} from 'chart.js';

let count = 0;

interface IProps {
  config: any;
}

class Chart extends React.Component<IProps, any> {

  private canvasID: string;
  private chart;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `chart-${count++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  private renderDOM() {
    if(this.chart !== undefined) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.chart = this.drawChart(this.canvasID, this.props.config);
  }

  private drawChart(canvasID: string, config) {
    const canvasElement = (document.getElementById(canvasID) as HTMLCanvasElement).getContext('2d');
    if (canvasElement === null) {
      throw new Error('The canvas element specified does not exist!');
    }
    return new ChartJS(canvasElement, config);
  }

  public render() {
    return (
      <div className="chart">
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export {Chart};
