import { useEffect, useState, useRef, useContext } from "react";
import OOutline from "@components/icons/OOutline";
import XOutline from "@components/icons/XOutline";
import Btn from "@components/shared/Btn";
import Logo from "@components/shared/Logo";
import User from "@interfaces/User";
import Loading from "@components/loading/Loading";
import { useNavigate } from "react-router-dom";
import socketService from "@app/socket/Socket";
import useSocketConnect from "@hooks/useSocketConnect";
import { ModalContext } from "@context/ContextModal";
import RoomClass from "@app/room/Room";

function Home() {
  const modal = useContext(ModalContext);
  const navigate = useNavigate();
  const [pickPlayer, setPickPlayer] = useState<boolean>(true);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const { isLoading } = useSocketConnect();
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (isLoading) {
      socketService.connect();
    }
  }, [isLoading]);

  // useEffect(() => {
  //   if (isLoading) {
  //     socketService.connect();
  //     return;
  //   }
  //
  //   const handleFetchRoom = (data: { room: RoomClass }) => {
  //     if (data?.room?.id) {
  //       clearInterval(interval);
  //       navigate("/room");
  //     }
  //
  //     else clearInterval(interval);
  //
  //   }
  //
  //   socketService.listen('room_info', (data: { room: RoomClass }) => handleFetchRoom(data));
  //
  //   const interval = setInterval(() => {
  //     socketService.emit('get_room', { "user_id": user?.id });
  //   }, 500);
  //
  //   return () => {
  //     socketService.removeListener('room_info', handleFetchRoom);
  //     clearInterval(interval);
  //   }
  //
  // }, [isLoading])

  useEffect(() => {
    if (!window.localStorage.getItem("user")) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(window.localStorage.getItem("user") || "{}"));
    }
  }, []);

  useEffect(() => {
    const onJoinRoomSuccess = (data: { room: RoomClass }) => {
      navigate("/room");
    };

    const onJoinRoomFailed = (data: { message: string }) => {
      modal?.setModal({
        showModal: true,
        title: "Notification",
        message: {
          text: data.message,
          img: "",
          color: "",
        },
        btnYellow: "Quit",
        btnGray: "no, cancel",
        isNextRound: false,
      });
    };

    socketService.listen("room_created", (data: { room: RoomClass }) =>
      onJoinRoomSuccess(data),
    );
    socketService.listen("joined_room", (data: { room: RoomClass }) =>
      onJoinRoomSuccess(data),
    );
    socketService.listen("join_room_failed", (data: { message: string }) =>
      onJoinRoomFailed(data),
    );

    return () => {
      socketService.removeListener("room_created", onJoinRoomSuccess);
      socketService.removeListener("joined_room", onJoinRoomSuccess);
      socketService.removeListener("join_room_failed", onJoinRoomFailed);
    };
  }, []);

  const handleJoinRoom = () => {
    socketService.emit("join_room", {
      room_id: roomIdRef.current?.value,
      user_id: user?.id,
    });
  };

  const onCreateRoom = () => {
    console.log({ room_name: "", user_id: user?.id });
    socketService.emit("create_room", { room_name: "", user_id: user?.id });
  };
  // how to add a new func for listening event from server

  const handlePickPlayer = () => setPickPlayer(!pickPlayer);

  return isLoading ? (
    <Loading />
  ) : (
    <section className="w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
      <Logo width={10} height={10} />
      <article className="bg-black-300 w-[90%] rounded-lg p-5 text-center">
        <h1 className="font-bold mb-5 text-lg">Hello {user?.name}</h1>

        <article className="bg-black-400 py-3 rounded-lg flex w-full mb-5">
          <button
            onClick={() => !pickPlayer && handlePickPlayer()}
            className={`${
              pickPlayer && `bg-gray-400 rounded-lg px-3 py-3 ml-3`
            } w-1/2 mx-auto flex justify-center items-center`}
          >
            <XOutline state={!pickPlayer} />
          </button>
          <button
            onClick={() => pickPlayer && handlePickPlayer()}
            className={`${
              !pickPlayer && `bg-gray-400 rounded-lg px-6 py-3 mr-3`
            } w-1/2 mx-auto flex justify-center items-center`}
          >
            <OOutline state={pickPlayer} />
          </button>
        </article>

        <h3 className="text-gray-500">REMEMBER : X GOES FIRST</h3>
      </article>

      <article className="flex flex-col gap-3 w-[90%]">
        <div
          onClick={() => {
            onCreateRoom();
          }}
          className="w-full bg-yellow-500 rounded-2xl pb-2"
        >
          <Btn classCSS="bg-yellow-400 rounded-2xl w-full py-2">
            Create Room
          </Btn>
        </div>

        <div className="w-full rounded-2xl pb-2 flex flex-row gap-2">
          <input
            type="text"
            placeholder="ROOM ID"
            className="bg-blue-400 rounded-2xl grow text-black-400 text-center placeholder-gray-300"
            ref={roomIdRef}
          />
          <Btn
            classCSS="bg-blue-400 rounded-2xl py-2 grow-0 px-1"
            onClick={() => {
              handleJoinRoom();
            }}
          >
            Join Room
          </Btn>
        </div>
      </article>
    </section>
  );
}
export default Home;
