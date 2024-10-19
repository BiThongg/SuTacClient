import Header from "@components/game/Header";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import { useNavigate } from "react-router-dom";
import useSocketConnect from "@hooks/useSocketConnect";
import Loading from "@components/loading/Loading";
import useBotMode, { GameHook } from "@hooks/useBotMode";

export default function Game() {
  const navigate = useNavigate()

  const { isLoading }: { isLoading: boolean } = useSocketConnect()
  const { game, onMove }: GameHook = useBotMode()

  return (
    isLoading ? <Loading /> :
      <section className="h-screen md:h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col justify-center items-center">
        <Header isTurnX={game?.turn} />
        {game?.board.length === 3 ? (<TicTacToeBoard board={game?.board} onMove={onMove} />) : (<SumokuBoard board={game?.board} />)}
      </section>
  );
}

