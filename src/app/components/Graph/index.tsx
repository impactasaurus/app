import * as React from 'react';
import {GraphData, getMaximumNumberOfPointsPerSeries} from 'models/graph';
import {Message} from 'semantic-ui-react';
import { Chart } from 'components/Chart';

interface IProps {
  data: GraphData;
}

class Graph extends React.Component<IProps, any> {

  private prepareDataset(data: GraphData): any {
    return data.series.map((x) => {
      return {
        label: x.label,
        data: x.data.sort((a, b) => {
          return a.x.getTime() - b.x.getTime();
        }),
        fill: false,
      };
    });
  }

  private chartConfig(data: GraphData) {
    return {
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
          yAxes: [{
            ticks: {
              min: data.scaleMin,
              max: data.scaleMax,
            },
          }],
        },
      },
    };
  }

  public render() {
    if (Array.isArray(this.props.data.series) === false) {
      return <div />;
    }

    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <div className="graph">
          {inner}
        </div>
      );
    };

    const noRecords = getMaximumNumberOfPointsPerSeries(this.props.data);
    if (noRecords <= 1) {
      return wrapper((
        <Message info={true} >
          <Message.Header>Incompatible Visualisation</Message.Header>
          <Message.Content>The data contains less than two records, and as such, cannot be visualised as a line graph. Please select a different visualisation.</Message.Content>
        </Message>
      ));
    }
    return wrapper((
      <Chart config={this.chartConfig(this.props.data)} />
    ));
  }
}

export {Graph};
