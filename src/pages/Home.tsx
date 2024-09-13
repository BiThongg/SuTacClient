import { useEffect, useState, useRef } from "react";
import OOutline from "@components/icons/OOutline";
import XOutline from "@components/icons/XOutline";
import Btn from "@components/shared/Btn";
import Logo from "@components/shared/Logo";
import User from "@interfaces/User";
import { Room } from "@app/room/Room";
import Loading from "@components/loading/Loading";
import { useNavigate } from "react-router-dom";
import socketService from "@app/socket/Socket";
import useSocketConnect from "@hooks/useSocketConnect";

function Home() {
  const navigate = useNavigate();
  const [pickPlayer, setPickPlayer] = useState<boolean>(true);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const { isLoading } = useSocketConnect();
  const [user, setUser] = useState<User | undefined>(JSON.parse(localStorage.getItem("user")) || undefined);

  useEffect(() => {
    socketService.connect();
  }, []);

  socketService.listen("register", (data: { user: User }) => saveUser(data))
  socketService.listen("room_create", (data: { room: Room }) => onListenRoomCreateEvent(data))

  const saveUser = (data: { user: User }) => {
    window.localStorage.setItem("user", JSON.stringify(data.user))
    setUser(data.user)
  }

  const onRegister = () => {
    const name: string | undefined = userNameRef.current?.value;

    if (!name) {
      alert("Please enter your name")
      return
    }
    socketService.emit("register", { name: name })
  }

  const handleJoinRoom = () => {
    // const name: string | undefined = roomIdRef.current?.value;
    //
    // if (!name) return;
    // socketService.emit("register", { name: name })
    alert("This feature is not available yet")
  }

  const onCreateRoom = () => {
    socketService.emit("create_room", { room_name: "vai chuong" })
  }

  const onListenRoomCreateEvent = (data: { room: Room }) => {
    // add room as global data 
    window.room = data.room
    navigate("/room")
  }


  // how to add a new func for listening event from server 

  const handleClick = (typeGame: string) => {
    const localTypeGame = localStorage.getItem("typeGame") || "";
    const localPickPlayer = localStorage.getItem("pickPlayer") || "";

    const pickPlayerString = pickPlayer ? "X" : "O";

    if (localPickPlayer !== pickPlayerString || localTypeGame !== typeGame) {
      localStorage.removeItem("score");
    }

    localStorage.setItem("pickPlayer", pickPlayerString);
    localStorage.setItem("typeGame", typeGame);

    navigate("/game", {replace : true});
  };

  const handlePickPlayer = () => setPickPlayer(!pickPlayer);

  return (
    isLoading ? <Loading /> :
      (user == undefined ?
        <div className="flex flex-col content-center gap-2">
          <Logo width={10} height={10} />
          <div
            className="w-full rounded-2xl pb-2 flex flex-row gap-2"
          >
            <input type="text" placeholder="USER NAME" className="bg-blue-400 rounded-2xl grow text-black-400 text-center placeholder-gray-300" ref={userNameRef} />
            <Btn classCSS="bg-blue-400 rounded-2xl py-2 grow-0 px-2" onClick={() => onRegister()}>
              Register
            </Btn>
          </div>
        </div>
        :
        <section className="h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
          <Logo width={10} height={10} />
          <article className="bg-black-300 w-[90%] rounded-lg p-5 text-center">
            <h1 className="font-bold mb-5 text-lg">PICK PLAYER 1’S MARK</h1>

            <article className="bg-black-400 py-3 rounded-lg flex w-full mb-5">
              <button
                onClick={() => !pickPlayer && handlePickPlayer()}
                className={`${pickPlayer && `bg-gray-400 rounded-lg px-3 py-3 ml-3`
                  } w-1/2 mx-auto flex justify-center items-center`}
              >
                <XOutline state={!pickPlayer} />
              </button>
              <button
                onClick={() => pickPlayer && handlePickPlayer()}
                className={`${!pickPlayer && `bg-gray-400 rounded-lg px-6 py-3 mr-3`
                  } w-1/2 mx-auto flex justify-center items-center`}
              >
                <OOutline state={pickPlayer} />
              </button>
            </article>

            <h3 className="text-gray-500">REMEMBER : X GOES FIRST</h3>
          </article>

          <article className="flex flex-col gap-3 w-[90%]">
            <div
              onClick={() => onCreateRoom()}
              className="w-full bg-yellow-500 rounded-2xl pb-2"
            >
              <Btn classCSS="bg-yellow-400 rounded-2xl w-full py-2">
                Create Room
              </Btn>
            </div>

            <div
              className="w-full rounded-2xl pb-2 flex flex-row gap-2"
            >
              <input type="text" placeholder="ROOM ID" className="bg-blue-400 rounded-2xl grow text-black-400 text-center placeholder-gray-300" ref={roomIdRef} />
              <Btn classCSS="bg-blue-400 rounded-2xl py-2 grow-0 px-1" onClick={() => handleJoinRoom()}>
                Join Room
              </Btn>
            </div>
          </article>
        </section>
      ));
}

export default Home;
