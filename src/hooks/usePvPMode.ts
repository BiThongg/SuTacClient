
import { Game } from "@interfaces/Game";
import { Player } from "@app/player/Player";
import { Cell } from "@app/Utils";
import { BotMoveRequest } from "@interfaces/BotMoveRequest";
import { PersonMoveRequest } from "@interfaces/PersonMoveRequest";
import { useEffect, useState } from "react";
import { GameHook } from "@interfaces/GameHook";
import socketService from "@app/socket/Socket";
import User from "@app/user/User";


export default function usePvPMode(): GameHook {
  const [game, setGame] = useState<Game>(window?.game || {});
  const [user, __] = useState<User>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {});

  const player: Player = game.players.filter(player =>
    player?.user?.id === user.id
  )[0]

  socketService.listen('moved', (data: { game: Game }) => {
    setGame(data.game)
  });

  socketService.listen('bot_move', (data: { game: Game }) => {
    setIsWaitBot(false)
  });

  socketService.listen('bot_move_failed', (data: { message: string }) => { console.log(data.message) });

  const onMove = (point: { x: number, y: number }) => {
    const gameTurn: Cell = game?.turn;

    if (gameTurn === player.symbol) {
      const moveRequest: PersonMoveRequest = { "room_id": window?.room?.id, "point": point, "user_id": user.id };
      socketService.emit('move', moveRequest);
    }

    else {
      alert("Not your turn");
    }
  }

  return { game, onMove };
}
