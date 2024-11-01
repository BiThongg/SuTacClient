import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Btn from '@components/shared/Btn';
import Logo from '@components/shared/Logo';
import User from '@app/user/User';
import Game from '@app/game/Game';
import Loading from '@components/loading/Loading';
import RoomClass from '@app/room/Room';

import socketService from '@app/socket/Socket';
import useSocketConnect from '@hooks/useSocketConnect';
import { ModalContext } from '@context/ContextModal';
import RingSpin from "@assets/ring-resize.svg";
import ChatBox from './ChatBox';

enum GameType {
  SUMOKU = "CASUAL",
  TIC_TAC_TOE = "TIC_TAC_TOE",
}

export default function Room() {

  const [pickGameType, setGameType] = useState<string>(GameType.TIC_TAC_TOE);
  const [player, _] = useState<User>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [room, setRoom] = useState<RoomClass>();
  const navigate = useNavigate();
  const { isLoading } = useSocketConnect()
  const preventPointer = player.id !== room?.owner?.info.id ? 'pointer-events-none' : '';
  const modal = useContext(ModalContext);

  useEffect(() => {
    if (isLoading) {
      socketService.connect();
      return;
    }

    const handleFetchRoom = (data: { room: RoomClass }) => {
      if (!data?.room?.id) {
        navigate('/');
        return;
      }

      setRoom(data.room);
    }

    socketService.listen('room_info', (data: { room: RoomClass }) => handleFetchRoom(data));

    const interval = setInterval(() => {
      if (!player || !player?.id) {
        navigate('/');
        return;
      }

      if (room?.id) {
        window.room = room;
        clearInterval(interval);
      }
      socketService.emit('get_room', { "user_id": player.id });
    }, 500);

    return () => {
      socketService.removeListener('room_info', handleFetchRoom);
      clearInterval(interval);
    }

  }, [isLoading])


  useEffect(() => {
    const handleKick = (data: { room: RoomClass, kicked_id: string }) => {
      if (data.kicked_id !== player.id) {
        window.room = data.room;
        setRoom(data.room);
        return;
      }

      window.room = {};
      modal?.setModal({
        showModal: true,
        title: "Notification",
        message: {
          text: "You have been kicked out of the room",
          img: "",
          color: "",
        },
        btnYellow: "Quit",
        btnGray: "no, cancel",
        isNextRound: false,
      });
      navigate('/');
    }

    const handleStartGame = (data: { message: string, game: Game }) => {
      window.game = data.game;
      navigate('/game');
    }


    const handleStartGameFailed = (data: { message: string }) => {
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
    }

    const handleJoinRoom = (data: { room: RoomClass }) => {
      window.room = data.room;
      setRoom(data.room)
    }

    const handleChangeGameType = (data: { game_type: string, room_id: string }) => {
      setGameType(data.game_type);
    }

    const onListenAddBotEvent = (data: { room: RoomClass }) => {
      window.room = data.room;
      setRoom(data.room);
    }

    const handleLeaveRoom = (data: { room: RoomClass, leave_id: string }) => {
      if (data.leave_id !== player.id) {
        window.room = data.room;
        setRoom(data.room);
        return;
      }

      window.room = {};
      navigate('/');
    }

    const onRoomDestroyed = (data: { message: string }) => {
      modal?.setModal({
        showModal: true,
        title: "Notification",
        message: {
          text: "Room Expired",
          img: "",
          color: "",
        },
        btnYellow: "Quit",
        btnGray: "no, cancel",
        isNextRound: false,
      });
      navigate('/');
    }


    socketService.listen("game_type_changed", (data: { game_type: string, room_id: string }) => handleChangeGameType(data));
    socketService.listen('started_game', (data: { message: string, game: Game }) => handleStartGame(data));
    socketService.listen('kicked', (data: { room: RoomClass, kicked_id: string }) => handleKick(data));
    socketService.listen('added_bot', (data: { room: RoomClass }) => onListenAddBotEvent(data));
    socketService.listen('start_game_failed', (data: { message: string }) => handleStartGameFailed(data));
    socketService.listen("joined_room", (data: { room: RoomClass }) => handleJoinRoom(data));
    socketService.listen('leaved_room', (data: { room: RoomClass, leave_id: string }) => handleLeaveRoom(data));
    // socketService.listen("room_destroyed", (data: { message: string }) => onRoomDestroyed(data));

    return () => {
      socketService.removeListener('game_type_changed', handleChangeGameType);
      socketService.removeListener('started_game', handleStartGame);
      socketService.removeListener('kicked', handleKick);
      socketService.removeListener('added_bot', onListenAddBotEvent);
      socketService.removeListener('start_game_failed', handleStartGameFailed);
      socketService.removeListener("joined_room", handleJoinRoom);
      socketService.removeListener('leave_room', handleLeaveRoom);
      // socketService.removeListener("room_destroyed", onRoomDestroyed);
    };

  }, [])


  const onStartGame = () => {
    if (room?.owner.info.id !== player.id) return;
    socketService.emit('start_game', { "room_id": room.id, "game_type": pickGameType, "user_id": player.id });
  }

  const handlePickGameType = (gameType: GameType) => {
    if (room?.owner.info.id !== player.id) return;
    socketService.emit('change_game_type', { "room_id": room?.id, "game_type": gameType });
  }

  const onAddBot = () => {
    socketService.emit('add_bot', { "room_id": room.id, "user_id": player.id });
  }

  const onLeaveRoom = () => {
    socketService.emit('leave_room', { "room_id": room.id });
  }


  const onKick = (kick_id: string) => {
    // console.log(kick_id)
    socketService.emit('kick', { "room_id": room.id, "kick_id": kick_id, "owner_id": player.id });
  }

  return (
    (!isLoading && room?.id) ?
      <section className="h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
        <Logo width={10} height={10} />
        <button className="bg-yellow-400 rounded-full w-15 px-3 py-3 text-black-300 top-5 left-5 absolute" onClick={onLeaveRoom}>
          Leave Room
        </button>

        <ChatBox currentUserId={player.id} roomId={room.id} />
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
          {
            room.owner.info.id === player.id &&
            <div className="w-full bg-yellow-500 rounded-2xl pb-2">
              <Btn classCSS={`bg-yellow-400 rounded-2xl w-full py-2 ${preventPointer}`} onClick={() => onStartGame()}>
                START GAME
              </Btn>
            </div>
          }

          <div className="w-[20%] rounded-2xl pb-2 cursor-auto flex flex-row gap-2 w-full">
            <Btn classCSS="bg-blue-400 rounded-full w-full py-2" onClick={() => {
              // console.log(room)
            }}>
              <div className='text-[15px] flex justify-center'>
                <p>User Name:</p>
                <span className='text-white'>{room?.owner?.info.name}</span>
              </div>
            </Btn>

            {room?.competitor ? (
              <div className="bg-blue-400 rounded-full w-full flex justify-center gap-10 text-black-400 text-[15px] p-3 py-4" >

                <div className='text-white'>
                  <p className='text-black-400'>USER NAME:</p>
                  {room?.competitor?.info?.name}
                </div>
                {
                  room.owner.info.id === player.id &&
                  <button className='bg-red-400 rounded-full w-10 px-3 flex items-center relative group' onClick={() => onKick(room?.competitor?.info?.id)}>
                    <p>X</p>
                    <div className="absolute w-full h-full bg-red-500 hidden group-hover:block bottom-11 left-6 text-white rounded-full pt-3">
                      <p className="">Kick</p>
                    </div>
                  </button>
                }

              </div>
            ) :
              (
                <div className='bg-blue-400 rounded-full w-full py-2 flex justify-around text-black-400 text-[15px] p-3 gap-3'>
                  <div className='flex justify-center items-center gap-3 text-[15px]'>
                    <p className=''>Waiting</p>
                    <img src={RingSpin} className="text-white" />
                  </div>
                  <button className='bg-red-400 rounded-full w-15 px-3 py-3' onClick={onAddBot}>
                    Add Bot
                  </button>
                </div>
              )}
          </div>
        </article>
      </section>
      : <Loading />
  );
}

