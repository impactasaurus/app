import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes';
import {fillCanvasWithColour} from 'helpers/canvas';
import distinctColors from 'distinct-colors';

Chart.plugins.register({
  afterRender: (c) => {
    fillCanvasWithColour(c.canvas, 'white');
  },
});

export const getChartJSTypographyStyle = () => ({
  fontSize: 14,
  fontFamily: '"Source Sans Pro", "Arial", "Helvetica", "sans-serif"',
});

export const getColorScheme = (noSeries: number): string|string[] => {
  if (noSeries === 3) {
    return ['#2f1d2d', '#774b71', '#b488ae'];
  }
  return distinctColors({count: noSeries}).map((c) => c.hex());
};

Chart.defaults.global.defaultFontFamily = getChartJSTypographyStyle().fontFamily;
Chart.defaults.global.defaultFontSize = getChartJSTypographyStyle().fontSize;
