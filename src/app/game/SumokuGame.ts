import Game from "./Game";

export class SumokuGame extends Game {
  constructor(size = 15) {
    super(size);
  }

  getWinner() {}
  updateTurn() {}
  randomSeed() {}
}
