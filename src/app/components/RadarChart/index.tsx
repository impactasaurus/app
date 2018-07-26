import * as React from 'react';
import {getOutcomeGraph} from './outcomeGraph';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Message} from 'semantic-ui-react';
import './style.less';

let count = 0;

interface IProp {
  data?: RadarData;
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

interface IState {
  err: boolean;
}

function getAxisTitle(original: string): string {
  if (original.length > 40) {
    return original.substring(0,40) + '...';
  }
  return original;
}

export type OutcomeGraphData = IOutcomeGraphSeries[];

class RadarChart extends React.Component<IProp, IState> {

  private canvasID: string;
  private graph;

  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
    this.canvasID = `meeting-view-${count++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  private convertData(data: IRadarSeries[]): OutcomeGraphData {
    return data.map((s: IRadarSeries): IOutcomeGraphSeries => {
      return {
        notes: s.note,
        timestamp: (s.name instanceof Date) ? s.name.toISOString() : s.name,
        disabled: s.disabled,
        outcomes: s.datapoints.map((d: IRadarPoint): IOutcomeGraphPoint => {
          return {
            notes: d.note,
            value: d.value,
            outcome: getAxisTitle(d.axis),
          };
        }),
      };
    });
  }

  private getNumberOfAxis(data: IRadarSeries[]): number {
    return data.reduce((maxAxis, series) => {
      if (series.datapoints.length > maxAxis) {
        return series.datapoints.length;
      }
      return maxAxis;
    }, 0);
  }

  private renderDOM() {
    if (Array.isArray(this.props.data.series) === false) {
      return;
    }
    if(this.graph !== undefined) {
      this.graph.destroy();
      this.graph = undefined;
    }
    const noAxis = this.getNumberOfAxis(this.props.data.series);
    let errored = true;
    if (noAxis >= 3) {
      this.graph = getOutcomeGraph(this.canvasID, this.convertData(this.props.data.series), this.props.data.scaleMin, this.props.data.scaleMax);
      errored = false;
    }
    if (errored !== this.state.err) {
      this.setState({
        err: errored,
      });
    }
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  private renderError(err: boolean): JSX.Element {
    if (err === false) {
      return (<div />);
    }
    return (
      <Message info={true} >
        <Message.Header>Incompatible Visualisation</Message.Header>
        <Message.Content>The data contains less than three axis, and as such, cannot be visualised as a radar chart. Please select a different visualisation or aggregation.</Message.Content>
      </Message>
    );
  }

  public render() {
    return (
      <div className="radar">
        {this.renderError(this.state.err)}
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export { RadarChart };
