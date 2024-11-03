import socketService from "@app/socket/Socket";
import useSocketConnect from "@hooks/useSocketConnect";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import User from "@interfaces/User";
import Loading from "@components/loading/Loading";
import Logo from "@components/shared/Logo";
import Btn from "@components/shared/Btn";

function Auth() {
  const { isLoading } = useSocketConnect();
  const navigate = useNavigate();
  const userNameRef = useRef<any>();

  useEffect(() => {
    socketService.connect();
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    socketService.listen("register", (data: { user: User }) => {
      saveUser(data);
    });
  }, []);

  const saveUser = (data: { user: User }) => {
    const user: User = { name: data.user.name, id: data.user.id };
    window.localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  const onRegister = () => {
    const name: string | undefined = userNameRef.current?.value;

    if (!name) {
      alert("Please enter your name");
      return;
    }
    socketService.emit("register", { name: name });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col content-center gap-2">
      <Logo width={10} height={10} />
      <div className="w-full rounded-2xl pb-2 flex flex-row gap-2">
        <input
          type="text"
          placeholder="USER NAME"
          className="bg-blue-400 rounded-2xl grow text-black-400 text-center placeholder-gray-300"
          ref={userNameRef}
        />
        <Btn
          classCSS="bg-blue-400 rounded-2xl py-2 grow-0 px-2"
          onClick={() => onRegister()}
        >
          Register
        </Btn>
      </div>
    </div>
  );
}

export default Auth;
