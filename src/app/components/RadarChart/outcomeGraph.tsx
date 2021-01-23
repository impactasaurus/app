import Chart from 'chart.js';
import {SessionsConverter} from './sessionsConverter';
import {OutcomeGraphData} from './index';
import {getChartJSTypographyStyle} from 'theme/chartStyle';
const sessionsConverter = SessionsConverter();

export function getOutcomeGraph(canvasDiv, data: OutcomeGraphData, min, max) {
  const chartConfig = getConfig(data, min, max);
  const canvasElement = document.getElementById(canvasDiv);
  if (canvasElement === null) {
    throw new Error('The canvas element specified does not exist!');
  }

  return new Chart(canvasElement, chartConfig);
}

function getConfig(data: OutcomeGraphData, min, max) {
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
        pointLabels: getChartJSTypographyStyle(),
      },
      tooltips: {
        mode: 'point',
        enabled: true,
      },
      aspectRatio: 1,
    },
  };
}

module.exports.getOutcomeGraph = getOutcomeGraph;
