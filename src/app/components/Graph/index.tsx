import * as React from 'react';
import {GraphData, getMaximumNumberOfPointsPerSeries} from 'models/graph';
import * as Chart from 'chart.js';
import * as color from 'chartjs-color';
import * as distinctColors from 'distinct-colors';
import {Message} from 'semantic-ui-react';

let graphCount = 0;

interface IProps {
  data: GraphData;
}

interface IState {
  err: boolean;
}

class Graph extends React.Component<IProps, IState> {

  private canvasID: string;
  private graph;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `graph-${graphCount++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  private renderDOM() {
    if (Array.isArray(this.props.data) === false) {
      return;
    }
    if(this.graph !== undefined) {
      this.graph.destroy();
      this.graph = undefined;
    }

    const noRecords = getMaximumNumberOfPointsPerSeries(this.props.data);
    let errored = true;
    if (noRecords > 1) {
      this.graph = this.drawChart(this.canvasID, this.props.data);
      errored = false;
    }

    if (errored !== this.state.err) {
      this.setState({
        err: errored,
      });
    }
  }

  private prepareDataset(data: GraphData): any {
    const colours = distinctColors({count: data.length});
    return data.map((x, idx) => {
      const colour = color().rgb(colours[idx].rgba()).rgbString();
      return {
        label: x.label,
        data: x.data.sort((a, b) => {
          return a.x.getTime() - b.x.getTime();
        }),
        backgroundColor: color(colour).alpha(0.2).rgbString(),
        borderColor: colour,
        pointBackgroundColor: colour,
        fill: false,
      };
    });
  }

  private drawChart(canvasID: string, data: GraphData) {
    const canvasElement = (document.getElementById(canvasID) as HTMLCanvasElement).getContext('2d');
    if (canvasElement === null) {
      throw new Error('The canvas element specified does not exist!');
    }
    return new Chart(canvasElement, {
      type: 'line',
      data: {
        datasets: this.prepareDataset(data),
      },
      options: {
        tooltips: {
          mode: 'point',
        },
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        },
        scales: {
          xAxes: [{
            type: 'time',
          }],
        },
      },
    });
  }

  private renderError(err: boolean): JSX.Element {
    if (err === false) {
      return (<div />);
    }
    return (
      <Message info={true} >
        <Message.Header>Incompatible Visualisation</Message.Header>
        <Message.Content>The data contains less than two records, and as such, cannot be visualised as a line graph. Please select a different visualisation.</Message.Content>
      </Message>
    );
  }

  public render() {
    return (
      <div className="graph">
        {this.renderError(this.state.err)}
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export {Graph};
