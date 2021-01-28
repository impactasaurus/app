import * as React from 'react';
import {Chart as ChartJS} from 'chart.js';
import { getColorScheme } from 'theme/chartStyle';
import { loadBrandChartColorScheme, shouldLoadBranding } from 'theme/branding';

let count = 0;

interface IStyleOptions {
  fillAlpha?: number;
}

interface IProps {
  config: any;
  style?: IStyleOptions;
}

interface IState {
  style: (noSeries: number) => string|string[];
}

class Chart extends React.Component<IProps, IState> {

  private canvasID: string;
  private chart;

  constructor(props) {
    super(props);
    this.state = {
      style: getColorScheme,
    };
    if(shouldLoadBranding()) {
      loadBrandChartColorScheme()
      .then((fn) => {
        this.setState({style: fn});
      })
      .catch((err) => {
        console.error(err);
      });
    }
    this.canvasID = `chart-${count++}`;
    this.renderDOM = this.renderDOM.bind(this);
    this.applyStyling = this.applyStyling.bind(this);
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
    this.chart = this.drawChart(this.canvasID, this.props.config, this.props.style || {});
  }

  private applyStyling(config, style?: IStyleOptions) {
    const out = { ...config};
    if(!out.options.plugins) {
      out.options.plugins = {};
    }
    out.options.plugins.colorschemes = {
      scheme: this.state.style(config.data.datasets.length),
      fillAlpha: style.fillAlpha || 1,
    };
    return out;
  }

  private drawChart(canvasID: string, config, style) {
    const canvasElement = (document.getElementById(canvasID) as HTMLCanvasElement).getContext('2d');
    if (canvasElement === null) {
      throw new Error('The canvas element specified does not exist!');
    }
    return new ChartJS(canvasElement, this.applyStyling(config, style));
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
