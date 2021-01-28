import * as React from 'react';
import {getConfig} from './outcomeGraph';
import {RadarData, IRadarSeries, IRadarPoint} from 'models/radar';
import {Aggregation} from 'models/pref';
import {Message} from 'semantic-ui-react';
import './style.less';
import { Chart } from 'components/Chart';

interface IProp {
  data?: RadarData;
  aggregation?: Aggregation;
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

function getAxisTitle(original: string): string {
  if (original.length > 40) {
    return original.substring(0,40) + '...';
  }
  return original;
}

export type OutcomeGraphData = IOutcomeGraphSeries[];

class RadarChart extends React.Component<IProp, any> {

  private convertData(data: IRadarSeries[]): OutcomeGraphData {
    return data.map((s: IRadarSeries): IOutcomeGraphSeries => {
      return {
        notes: s.note,
        timestamp: (s.name instanceof Date) ? s.name.toISOString() : s.name,
        disabled: s.disabled,
        outcomes: s.datapoints.sort((a, b) => {
          return a.axisIndex - b.axisIndex;
        }).map((d: IRadarPoint): IOutcomeGraphPoint => {
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

  private renderError(): JSX.Element {
    let dims = 'dimensions';
    if (this.props.aggregation === Aggregation.QUESTION) {
      dims = 'questions';
    }
    if (this.props.aggregation === Aggregation.CATEGORY) {
      dims = 'categories';
    }
    return (
      <Message info={true} >
        <Message.Header>Incompatible Visualisation</Message.Header>
        <Message.Content>The questionnaire contains less than three {dims}, and as such, cannot be visualised as a radar chart. Please select a different visualisation or aggregation.</Message.Content>
      </Message>
    );
  }

  public render() {

    if (Array.isArray(this.props.data.series) === false) {
      return <div />;
    }

    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <div className="radar">
          {inner}
        </div>
      );
    };

    const noAxis = this.getNumberOfAxis(this.props.data.series);
    if (noAxis < 3) {
      return wrapper(this.renderError());
    }

    return wrapper((
      <Chart
        config={getConfig(this.convertData(this.props.data.series), this.props.data.scaleMin, this.props.data.scaleMax)}
        style={{fillAlpha: 0.2}}
      />
    ));
  }
}

export { RadarChart };
