import { Player } from "@app/player/Player";
import { Cell } from "@app/Utils";

export interface Game {
  board: Cell[][];
  players: Player[];
  turn: Cell;
}
