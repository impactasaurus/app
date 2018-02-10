// originated from github.com/ALDLife/outcome-graph

import * as Chart from 'chart.js';
import {SessionsConverter} from './sessionsConverter';
const sessionsConverter = SessionsConverter();

export function getOutcomeGraph(canvasDiv, data, min, max) {
  const chartConfig = getConfig(data, min, max);
  const canvasElement = document.getElementById(canvasDiv);
  if (canvasElement === null) {
    throw new Error('The canvas element specified does not exist!');
  }

  return new Chart(canvasElement, chartConfig);
}

function getConfig(data, min, max) {
  return {
    type: 'radar',
    data: sessionsConverter.getChartJSConvertedData(data),
    options: {
      legend: {
        position: 'top',
      },
      scale: {
        ticks: {
          min,
          max,
        },
      },
      tooltips: {
        mode: 'point',
        enabled: true,
      },
    },
  };
}

module.exports.getOutcomeGraph = getOutcomeGraph;
