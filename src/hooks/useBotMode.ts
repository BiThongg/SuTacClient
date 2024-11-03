import { Game } from "@interfaces/Game";
import { Player } from "@app/player/Player";
import { Cell } from "@app/Utils";
import { BotMoveRequest } from "@interfaces/BotMoveRequest";
import { PersonMoveRequest } from "@interfaces/PersonMoveRequest";
import { useContext, useEffect, useState } from "react";
import { GameHook } from "@interfaces/GameHook";
import socketService from "@app/socket/Socket";
import User from "@app/user/User";
import { ModalContext } from "@context/ContextModal";
import { useNavigate } from "react-router-dom";

export default function useBotMode(): GameHook {
  const navigate = useNavigate();
  const modal = useContext(ModalContext);
  const [game, setGame] = useState<Game>(window?.game || {});
  const [user, __] = useState<User>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {},
  );
  const [isWaitBot, setIsWaitBot] = useState<boolean>(false);

  const botSymbol: string = game.players.filter((e) => {
    const name = e.user?.name;
    const index = name?.indexOf("BOT_");

    return index == -1 ? false : true;
  })[0].symbol;

  const player: Player = game.players.filter(
    (player) => player?.user?.id === user.id,
  )[0];

  useEffect(() => {
    const botTurnInterval = setInterval(() => {
      if (game?.turn === botSymbol && !isWaitBot) {
        const botMoveRequest: BotMoveRequest = { room_id: window?.room?.id };
        socketService.emit("bot_move", botMoveRequest);
      }
    }, 500);

    return () => clearInterval(botTurnInterval);
  });

  socketService.listen("ended_game", (data: any) => {
    setTimeout(() => {
      modal?.setModal({
        showModal: true,
        title: "Notification",
        message: {
          text: data.message,
          img: "",
          color: "",
        },
        btnYellow: "OK",
        btnGray: "",
        isNextRound: false,
      });
      window.game = undefined;
      navigate("/room");
    }, 1000);
  });

  socketService.listen("moved", (data: { game: Game }) => {
    setGame(data.game);
  });

  socketService.listen("bot_move", (data: { game: Game }) => {
    setIsWaitBot(false);
  });

  // socketService.listen('bot_move_failed', (data: { message: string }) => { console.log(data.message) });

  const onMove = (point: { x: number; y: number }) => {
    const gameTurn: Cell = game?.turn;

    if (gameTurn === player.symbol) {
      const moveRequest: PersonMoveRequest = {
        room_id: window?.room?.id,
        point: point,
        user_id: user.id,
      };
      socketService.emit("move", moveRequest);
    } else {
      alert("Not your turn");
    }
  };

  return { game, onMove };
}
