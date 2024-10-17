import Header from "@components/game/Header";
import { useEffect, useState } from "react";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import { Player } from "@app/player/Player";
import socketService from "@app/socket/Socket";
import User from "@app/user/User";

function Game() {
  const [game, _] = useState<any>(window?.game || {});
  const [user, __] = useState<User>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {});

  useEffect(() => {
    console.log(window?.game)
    const owner: Player = game?.players[0];
    const competitor: Player = game?.players[1];
    console.log(window?.room?.id)
    // if (game?.turn === competitor.symbol && competitor.isBot()) {
    //   socketService.emit('bot_move', { "room_id": window?.room?.id });
    // }
  })

  socketService.listen('moved', (data: { game: any }) => { console.log(data.game) });
  // socketService.listen('bot_move', (data: { game: any }) => { console.log(data.game) });

  const onMove = (point: { x: number, y: number }) => {
    if (game?.turn === game?.players[0].symbol) { // person turn 
      socketService.emit('move', { "room_id": window?.room?.id, "point": point, "user_id": localStorage.getItem });
    }
    // else {
    //   socketService.emit('bot_move', { "room_id": window?.room?.id });
    // }
  }

  return (
    <section className="h-screen md:h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col justify-center items-center">
      <Header isTurnX={game?.turn} />

      {game?.board.length === 3 ? (<TicTacToeBoard board={game?.board} onMove = {() => {}} />) : (<SumokuBoard board={game?.board} />)}
    </section>
  );
}

export default Game;
