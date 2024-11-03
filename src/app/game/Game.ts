import { Player } from "../player/Player";
import Point, { Cell } from "../Utils";

export default abstract class Game {
  turn: Cell = Cell.X;
  players: Player[] = [];
  board: Cell[][];

  constructor(size: number) {
    this.board = Array.from({ length: size }, () =>
      Array(size).fill(Cell.EMPTY),
    );
  }

  getCurrentSymbol(): Cell {
    return this.turn;
  }

  getCurrentTurn(): Player | undefined {
    return this.players.find((player) => player.symbol === this.turn);
  }

  move(player: Player, point: Point): void {
    if (this.turn !== player.symbol) {
      throw new Error("Not your turn");
    }

    if (this.board[point.y][point.x] !== Cell.EMPTY) {
      throw new Error("Cell is not empty");
    }

    this.board[point.y][point.x] = player.symbol;
  }

  // handleMove(player: Player, point: Point): void {
  //   if (this.turn !== player.symbol) {
  //     throw new Error("Not your turn");
  //   }
  //
  //   if (this.board[point.y][point.x] !== Cell.EMPTY) {
  //     throw new Error("Cell is not empty");
  //   }
  //
  //   this.board[point.y][point.x] = player.symbol;
  //   this.updateTurn();
  // }

  addPlayer(player: Player): void {
    player.game = this;
    this.players.push(player);
  }

  removePlayer(player: Player): void {
    player.game = null;
    this.players = this.players.filter((p) => p !== player);
  }
  //
  // isGameOver(): boolean {
  //   return this.getWinner() !== undefined;
  // }

  // drawBoard(): void {
  //   const table = new Table({
  //     title: 'GAME SIEU DINH',
  //   });
  //
  //   const rows: string[][] = this.board.map((row, i) => {
  //     const formattedRow = row.map((cell) =>
  //       cell === Cell.NONE ? ' ' : cell.value
  //     );
  //     return [i.toString(), ...formattedRow];
  //   });
  //
  //   const columns = ['Y/X', ...Array.from({ length: this.board.length }, (_, i) => i.toString())];
  //   table.addColumn(columns);
  //   rows.forEach(row => table.addRow(row, { color: 'green' }));
  //
  //   // const consolePrinter = new Console();
  //   // consolePrinter.print(table);
  // }

  // abstract getWinner(): Player | undefined;
  // abstract updateTurn(): void;
  // abstract randomSeed(): void;
}
