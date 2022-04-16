import { SessionsConverter } from "./sessionsConverter";
import { OutcomeGraphData } from "./index";
import { getChartJSTypographyStyle } from "theme/chartStyle";
import { ChartConfiguration } from "chart.js";
const sessionsConverter = SessionsConverter();

export function getConfig(
  data: OutcomeGraphData,
  min: number,
  max: number
): ChartConfiguration {
  return {
    type: "radar",
    data: sessionsConverter.getChartJSConvertedData(data),
    options: {
      legend: {
        position: "top",
      },
      scale: {
        ticks: {
          min,
          max,
        },
        pointLabels: getChartJSTypographyStyle(),
      },
      tooltips: {
        mode: "point",
        enabled: true,
      },
      aspectRatio: 1,
      maintainAspectRatio: false, // allows us to support a max height
    },
  };
}
