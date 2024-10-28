import { Game } from "@interfaces/Game";
import { Player } from "@app/player/Player";
import { Cell } from "@app/Utils";
import { PersonMoveRequest } from "@interfaces/PersonMoveRequest";
import { useContext, useState } from "react";
import { GameHook } from "@interfaces/GameHook";
import socketService from "@app/socket/Socket";
import User from "@app/user/User";
import { ModalContext } from "@context/ContextModal";
import { useNavigate } from "react-router-dom";


export default function usePvPMode(): GameHook {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game>(window?.game || {});
  const [user, __] = useState<User>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {});
  const modal = useContext(ModalContext);

  const player: Player = game.players.filter(player =>
    player?.user?.id === user.id
  )[0]

  socketService.listen('moved', (data: { game: Game }) => {
    setGame(data.game)
  });

  socketService.listen('ended_game', (data: any) => {
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
      window.game = {};
      navigate('/room');
    }, 500)
  });

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
