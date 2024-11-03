export enum Cell {
  X = "X",
  O = "O",
  EMPTY = "",
}

export default class Point {
  constructor(
    public x: number,
    public y: number,
  ) {
    this.x = x;
    this.y = y;
  }
}
