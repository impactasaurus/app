import Chart from "chart.js";
import "chartjs-plugin-colorschemes";
import { fillCanvasWithColour } from "helpers/canvas";
import distinctColors from "distinct-colors";

Chart.plugins.register({
  beforeDraw: (c) => {
    fillCanvasWithColour(c.canvas, "white");
  },
});

export const getChartJSTypographyStyle = () => ({
  fontSize: 14,
  fontFamily: '"Source Sans Pro", "Arial", "Helvetica", "sans-serif"',
});

export enum SeriesType {
  SCALE = 1,
  INDEPENDENT = 2,
}

export type ColorSchemeGetter = (
  noSeries: number,
  seriesType: SeriesType
) => string | string[];

export const getColorScheme = (
  noSeries: number,
  seriesType: SeriesType
): string | string[] => {
  if (noSeries === 1) {
    return ["#935D8C"];
  }
  if (noSeries === 2 && seriesType === SeriesType.INDEPENDENT) {
    return ["#59B397", "#774b71"];
  }
  if (noSeries === 3 && seriesType === SeriesType.SCALE) {
    return ["#2f1d2d", "#774b71", "#b488ae"];
  }
  return distinctColors({
    count: noSeries,
    chromaMin: 30,
    chromaMax: 80,
    lightMin: 35,
    lightMax: 80,
  }).map((c) => c.hex());
};

Chart.defaults.global.defaultFontFamily =
  getChartJSTypographyStyle().fontFamily;
Chart.defaults.global.defaultFontSize = getChartJSTypographyStyle().fontSize;
