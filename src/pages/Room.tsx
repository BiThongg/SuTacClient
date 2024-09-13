import { useEffect, useState } from 'react';
import Btn from '@components/shared/Btn';
import Logo from '@components/shared/Logo';
import User from '@app/user/User';
import Game from '@app/game/Game';
import Loading from '@components/loading/Loading';

import { useNavigate } from "react-router-dom";
import socketService from '@app/socket/Socket';
import useSocketConnect from '@hooks/useSocketConnect';

enum GameType {
  SUMOKU = "CASUAL",
  TIC_TAC_TOE = "TIC_TAC_TOE",
}


function Room() {
  const [pickGameType, setGameType] = useState<string>(GameType.SUMOKU);
  const [player, _] = useState<User>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [room, setRoom] = useState<any>(window?.room || {})
  const { isLoading } = useSocketConnect()
  const navigate = useNavigate();

  socketService.listen('added_bot', (data: { room: Room }) => onListenAddBotEvent(data));
  socketService.listen('add_bot_failed', (data: { message: string }) => console.log(data.message));
  socketService.listen('start_game_failed', (data: { message: string }) => console.log(data.message));
  socketService.listen('started_game',
    (data: { message: string, game: Game }) => {
      console.log(data.message);
      window.game = data.game;
      console.log(window.game);
      navigate('/game');
    });



  const onStartGame = () => {
    socketService.emit('start_game', { "room_id": room.id, "game_type": pickGameType });
  }

  const handlePickPlayer = () => {
    if (pickGameType === GameType.SUMOKU) {
      setGameType(GameType.TIC_TAC_TOE);
    }

    else {
      setGameType(GameType.SUMOKU);
    }
  }

  const onAddBot = () => {
    socketService.emit('add_bot', { "room_id": room.id });
  }

  const onListenAddBotEvent = (data: { room: Room }) => {
    window.room = data.room;
    setRoom(data.room);
  }


  return (
    isLoading ? <Loading /> :
      <section className="h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
        <Logo width={10} height={10} />

        <article className="bg-black-300 w-[90%] rounded-lg p-5 text-center">
          <h1 className="font-bold mb-5 text-lg">PICK GAME TYPE!</h1>

          <article className="bg-black-400 py-3 rounded-lg flex w-full mb-5">
            <button
              onClick={() => pickGameType !== GameType.SUMOKU && handlePickPlayer()}
              className={`${pickGameType === GameType.SUMOKU && `bg-gray-400 rounded-lg px-3 py-3 ml-3`
                } w-1/2 mx-auto flex justify-center items-center`}
            >
              <p className={pickGameType === GameType.SUMOKU ?
                `text-black-400 font-bold text-lg` : `text-gray-400 font-bold text-lg`}>SUMOKU</p>
            </button>
            <button
              onClick={() => pickGameType !== GameType.TIC_TAC_TOE && handlePickPlayer()}
              className={`${pickGameType === GameType.TIC_TAC_TOE && `bg-gray-400 rounded-lg px-6 py-3 mr-3`
                } w-1/2 mx-auto flex justify-center items-center`}
            >
              <p className={pickGameType === GameType.TIC_TAC_TOE ?
                `text-black-400 font-bold text-lg` : `text-gray-400 font-bold text-lg`}>TIC TAC TOE</p>
            </button>
          </article>

          {<h3 className="text-gray-500">ROOM ID : {room?.id}</h3>}
        </article>

        <article className="flex flex-col gap-3 w-[90%]">
          <div
            className="w-full bg-yellow-500 rounded-2xl pb-2"
          >
            <Btn classCSS="bg-yellow-400 rounded-2xl w-full py-2" onClick={() => onStartGame()}>
              START GAME
            </Btn>
          </div>

          <div
            className="w-[20%] rounded-2xl pb-2 cursor-auto flex flex-row gap-2 w-full"
          >
            <Btn classCSS="bg-blue-400 rounded-full w-full py-2" onClick={() => console.log(room)}>
              {player.id + " " + player.name}
            </Btn>

            <Btn classCSS="bg-blue-400 rounded-full w-full py-2" onClick={() => onAddBot()}>
              {!room?.competitor ? "ADD BOT" : room.competitor.info.name}
            </Btn>
          </div>

        </article>
      </section>
  );
}

export default Room;
