import React, { useState } from "react";
import { Chart } from "components/Chart";
import { DropdownItemProps, DropdownProps, Select } from "semantic-ui-react";
import { SeriesType } from "theme/chartStyle";

export interface IAnswerDistributionSeries {
  name: string;
  values: number[];
}

export interface IAnswerDistribution {
  id: string;
  name: string;
  min: number;
  max: number;
  series: IAnswerDistributionSeries[];
}

export interface IProp {
  data: IAnswerDistribution[];
  selectLabel: string;
}

const prepareDataset = (data: IAnswerDistribution): any => {
  const seriesStyler = (x: IAnswerDistributionSeries) => {
    console.log(x.values);
    return {
      label: x.name,
      data: x.values.reduce((arr, v) => {
        const index = Math.round(v) - data.min;
        if (!arr[index]) {
          arr[index] = 1;
        } else {
          arr[index]++;
        }
        return arr;
      }, []),
      borderWidth: 1,
      borderSkipped: "left",
      fill: true,
    };
  };
  const labels: string[] = [];
  for (let index = data.min; index <= data.max; index++) {
    labels.push("" + index);
  }
  return {
    datasets: data.series.map(seriesStyler),
    labels: labels,
  };
};

const chartConfig = (data: IAnswerDistribution) => {
  return {
    type: "bar",
    data: prepareDataset(data),
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  };
};

export const AnswerDistribution = (p: IProp): JSX.Element => {
  if (p.data.length === 0) {
    return <div />;
  }

  const [selected, setSelected] = useState(p.data[0].id);

  const setSelectedDistribution = (_, data: DropdownProps) => {
    setSelected(data.value as string);
  };

  const getOptions = (): DropdownItemProps[] => {
    return p.data.map((d) => {
      return {
        key: d.id,
        value: d.id,
        text: d.name,
      };
    });
  };

  const data = p.data.find((d) => d.id === selected);
  if (!data) {
    setSelected(p.data[0].id);
    return <div />;
  }

  return (
    <div>
      <span>{p.selectLabel}</span>
      <Select
        className="answer-dist-select"
        value={selected}
        onChange={setSelectedDistribution}
        options={getOptions()}
      />
      <Chart
        config={chartConfig(data)}
        style={{ fillAlpha: 0.8, seriesType: SeriesType.INDEPENDENT }}
      />
    </div>
  );
};
