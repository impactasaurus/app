import { SeriesType } from "theme/chartStyle";

const getColorScheme = (
  noSeries: number,
  seriesType: SeriesType
): string | string[] => {
  if (noSeries === 3 && seriesType === SeriesType.SCALE) {
    return "brewer.PRGn3";
  }
  if (noSeries > 10) {
    return "tableau.Tableau20";
  }
  return "tableau.Tableau10";
};
export default getColorScheme;
