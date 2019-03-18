import * as Chart from 'chart.js';

export const getChartJSTypographyStyle = () => ({
  fontSize: 14,
  fontFamily: '"Source Sans Pro", "Arial", "Helvetica", "sans-serif"',
});

Chart.defaults.global.defaultFontFamily = getChartJSTypographyStyle().fontFamily;
Chart.defaults.global.defaultFontSize = getChartJSTypographyStyle().fontSize;
