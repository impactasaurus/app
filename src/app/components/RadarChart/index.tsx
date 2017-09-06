import * as React from 'react';
import {getOutcomeGraph} from './outcomeGraph';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
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
  outcomes: IOutcomeGraphPoint[];
}

type OutcomeGraphData = IOutcomeGraphSeries[];

class RadarChart extends React.Component<IProp, any> {

  private canvasID: string;

  constructor(props) {
    super(props);
    this.canvasID = `meeting-view-${count++}`;
    this.renderDOM = this.renderDOM.bind(this);
  }

  private convertData(data: RadarData): OutcomeGraphData {
    return data.map((s: IRadarSeries): IOutcomeGraphSeries => {
      return {
        notes: s.note,
        timestamp: (s.name instanceof Date) ? s.name.toISOString() : s.name,
        outcomes: s.datapoints.map((d: IRadarPoint): IOutcomeGraphPoint => {
          return {
            notes: d.note,
            value: d.value,
            outcome: d.axis,
          };
        }),
      };
    });
  }

  private renderDOM() {
    if (!this.props.data) {
      return;
    }
    getOutcomeGraph(this.canvasID, '', this.convertData(this.props.data));
  }

  public componentDidMount() {
    this.renderDOM();
  }

  public componentDidUpdate() {
    this.renderDOM();
  }

  public render() {
    return (
      <div className="radar">
        <canvas id={this.canvasID} />
      </div>
    );
  }
}

export { RadarChart }
