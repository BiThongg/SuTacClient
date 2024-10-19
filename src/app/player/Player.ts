
import Point, { Cell } from '../Utils';
import User from '../user/User';
import Game from '../game/Game';

class Player {
  game: Game | null = null;
  symbol: Cell = Cell.EMPTY;
  user: User | null;

  constructor(user: User | null = null, symbol: Cell = Cell.EMPTY) {
    this.user = user;
    this.symbol = symbol;
  }

  move(point: Point): void {
    if (this.game) {
      this.game.move(this, point)
    } else {
      throw new Error("Player is not associated with a game.");
    }
  }

  isBot(): boolean {
    const index = this.user?.name.indexOf("BOT_");
    return index == -1 ? false : true
  }
}

export { Player };
