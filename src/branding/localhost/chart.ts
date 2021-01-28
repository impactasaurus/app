const getColorScheme = (noSeries: number): string|string[] => {
  if(noSeries === 3) {
    return 'brewer.PRGn3';
  }
  return 'tableau.Tableau10';
};
export default getColorScheme;
