import type RoomClass from "@app/room/Room";
import type Game from "@app/game/Game";
export {};

declare global {
  // Define global types or interfaces here
  interface Window {}

  var game: Game | undefined;
  var room: RoomClass | undefined;
}
