import distinctColors from "distinct-colors";
import { SeriesType } from "theme/chartStyle";

const getColorScheme = (
  noSeries: number,
  seriesType: SeriesType
): string | string[] => {
  if (noSeries === 3 && seriesType === SeriesType.SCALE) {
    return ["#333", "#999", "#bbb"];
  }
  return distinctColors({
    count: noSeries,
  }).map((c) => c.hex());
};
export default getColorScheme;
