import { Game } from "@interfaces/Game";

export interface GameHook {
  game: Game;
  onMove: (point: { x: number, y: number }) => void;
}