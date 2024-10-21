import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Btn from '@components/shared/Btn';
import Logo from '@components/shared/Logo';
import User from '@app/user/User';
import Game from '@app/game/Game';
import Loading from '@components/loading/Loading';
import Spin from "@assets/spin.svg"
import RoomClass from '@app/room/Room';

import socketService from '@app/socket/Socket';
import useSocketConnect from '@hooks/useSocketConnect';

enum GameType {
  SUMOKU = "CASUAL",
  TIC_TAC_TOE = "TIC_TAC_TOE",
}

export default function Room() {
  const [pickGameType, setGameType] = useState<string>(GameType.SUMOKU);
  const [player, _] = useState<User>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [room, setRoom] = useState<RoomClass>(window?.room || {})
  const navigate = useNavigate();
  const { isLoading } = useSocketConnect()
  const preventPointer = player.id !== room?.owner?.info.id ? 'pointer-events-none' : '';

  useEffect(() => {
    if (!window.room?.id) {
      socketService.emit('get_room', { "user_id": player.id });
    }
  }, [])

  socketService.listen('started_game',
    (data: { message: string, game: Game }) => {

      if (data.game.players[0].user.id === player.id || data.game.players[1].user.id === player.id) {
        window.game = data.game;
        navigate('/game');
      }
    });

  socketService.listen('room_info', (data: { room: RoomClass }) => {
    setRoom(data.room);
  })

  socketService.listen('kicked', (data: { room: RoomClass }) => {
    window.room = data.room
    if (room?.competitor?.info?.id === player.id && data.room.id == room.id) {
      window.room = {}
      console.log("hehehehe")
      navigate('/');
    }

    if (data.room.owner.info.id === player.id) {
      setRoom(data.room);
    }
  });

  socketService.listen('added_bot', (data: { room: RoomClass }) => onListenAddBotEvent(data));
  // socketService.listen('add_bot_failed', (data: { message: string }) => console.log(data.message));
  socketService.listen('start_game_failed', (data: { message: string }) => {
    // console.log(data.message);
  });
  socketService.listen("joined_room", (data: { room: RoomClass }) => {
    setRoom(data.room);
  });
  socketService.listen("game_type_changed", (data: { game_type: string, room_id: string }) => {

    if (room.id == data.room_id) {
      setGameType(data.game_type);
    }
  });


  const onStartGame = () => {
    if (room.owner.info.id !== player.id) return;
    socketService.emit('start_game', { "room_id": room.id, "game_type": pickGameType, "user_id": player.id });
  }

  const handlePickGameType = (gameType: GameType) => {
    if (room.owner.info.id !== player.id) return;
    socketService.emit('change_game_type', { "room_id": room.id, "game_type": gameType });
  }

  const onAddBot = () => {
    socketService.emit('add_bot', { "room_id": room.id });
  }

  const onListenAddBotEvent = (data: { room: RoomClass }) => {
    window.room = data.room;
    setRoom(data.room);
  }

  const onKick = (kick_id: string) => {
    socketService.emit('kick', { "room_id": room.id, "kick_id": kick_id, "owner_id": player.id });
  }

  return (
    isLoading ? <Loading /> :
      <section className="h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
        <Logo width={10} height={10} />

        <article className="bg-black-300 w-[90%] rounded-lg p-5 text-center">
          <h1 className="font-bold mb-5 text-lg">PICK GAME TYPE!</h1>

          <article className="bg-black-400 py-3 rounded-lg flex w-full mb-5">
            <button
              onClick={() => handlePickGameType(GameType.SUMOKU)}
              className={`${pickGameType === GameType.SUMOKU && `bg-gray-400 rounded-lg px-3 py-3 ml-3`
                } w-1/2 mx-auto flex justify-center items-center ${preventPointer}`}
            >
              <p className={pickGameType === GameType.SUMOKU ?
                `text-black-400 font-bold text-lg` : `text-gray-400 font-bold text-lg`}>SUMOKU</p>
            </button>
            <button
              onClick={() => handlePickGameType(GameType.TIC_TAC_TOE)}
              className={`${pickGameType === GameType.TIC_TAC_TOE && `bg-gray-400 rounded-lg px-6 py-3 mr-3`
                } w-1/2 mx-auto flex justify-center items-center ${preventPointer}`}
            >
              <p className={pickGameType === GameType.TIC_TAC_TOE ?
                `text-black-400 font-bold text-lg` : `text-gray-400 font-bold text-lg`}>TIC TAC TOE</p>
            </button>
          </article>
          {<h3 className="text-gray-500">ROOM ID : {room?.id}</h3>}
        </article>

        <article className="flex flex-col gap-3 w-[90%]">
          <div className="w-full bg-yellow-500 rounded-2xl pb-2">
            <Btn classCSS={`bg-yellow-400 rounded-2xl w-full py-2 ${preventPointer}`} onClick={() => onStartGame()}>
              START GAME
            </Btn>
          </div>

          <div className="w-[20%] rounded-2xl pb-2 cursor-auto flex flex-row gap-2 w-full">
            <Btn classCSS="bg-blue-400 rounded-full w-full py-2" onClick={() => {
              console.log(room)
            }}>
              <div className='text-[15px] flex justify-center'>
                <p>User Name:</p>
                <span className='text-white'>{room?.owner?.info.name}</span>
              </div>
            </Btn>

            {room?.competitor ? (
              <div className="bg-blue-400 rounded-full w-full py-2 flex justify-center text-black-400 text-[15px] p-3" onClick={() => onKick(room?.competitor?.info?.id)}>
                <p>User Name:</p>
                <span className='text-white'>{room?.competitor?.info?.name}</span>
                {
                  room.owner.info.id === player.id &&
                  <button className='bg-red-400 rounded-full w-10 px-3 flex items-center relative group'>
                    <p>X</p>
                    <div className="absolute w-full h-full bg-red-500 hidden group-hover:block bottom-11 left-6 text-white rounded-full pt-3">
                      <p className="">Kick</p>
                    </div>
                  </button>
                }

              </div>
            ) :
              (
                <div className='bg-blue-400 rounded-full w-full py-2 flex justify-around text-black-400 text-[15px] p-3'>
                  <div className='flex justify-center items-center gap-1 text-[15px]'>
                    <p className=''>Waiting</p>
                    <img src={Spin} />
                  </div>
                  <button className='bg-red-400 rounded-full w-15 px-3 py-3' onClick={() => onAddBot()}>
                    Add Bot
                  </button>
                </div>
              )}
          </div>
        </article>
      </section>
  );
}

