import React from 'react';
import {GraphData, getMaximumNumberOfPointsPerSeries} from 'models/graph';
import {Message} from 'semantic-ui-react';
import { Chart } from 'components/Chart';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: GraphData;
}

const Graph = (p: IProps): JSX.Element => {
  const {t} = useTranslation();

  const prepareDataset = (data: GraphData): any => {
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

  const chartConfig = (data: GraphData) => {
    return {
      type: 'line',
      data: {
        datasets: prepareDataset(data),
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

  if (Array.isArray(p.data.series) === false) {
    return <div />;
  }

  const wrapper = (inner: JSX.Element): JSX.Element => {
    return (
      <div className="graph">
        {inner}
      </div>
    );
  };

  const noRecords = getMaximumNumberOfPointsPerSeries(p.data);
  if (noRecords <= 1) {
    return wrapper((
      <Message info={true} >
        <Message.Header>{t("Incompatible Visualisation")}</Message.Header>
        <Message.Content>{t("The data contains less than two records, and as such, cannot be visualised as a line graph. Please select a different visualisation.")}</Message.Content>
      </Message>
    ));
  }
  return wrapper((
    <Chart config={chartConfig(p.data)} />
  ));
}

export {Graph};
