import { SessionsConverter } from "./sessionsConverter";
import { OutcomeGraphData } from "./index";
import { getChartJSTypographyStyle } from "theme/chartStyle";
const sessionsConverter = SessionsConverter();

export function getConfig(data: OutcomeGraphData, min, max) {
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
    },
  };
}
