export enum Direction {
  ASC,
  DESC,
}

export const directionSpec = (d: Direction): "ascending" | "descending" => {
  return d === Direction.ASC ? "ascending" : "descending";
};
