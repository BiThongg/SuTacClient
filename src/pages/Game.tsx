import Header from "@components/game/Header";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import Loading from "@components/loading/Loading";
import { GameHook } from "@interfaces/GameHook";
import useSocketConnect from "@hooks/useSocketConnect";
import useBotMode from "@hooks/useBotMode";
// import usePvPMode from "@hooks/usePvPMode";

export default function Game() {

  const { isLoading }: { isLoading: boolean } = useSocketConnect()
  const sizeBoard = window?.game?.board.length
  const { game, onMove }: GameHook = useBotMode()

  return (
    isLoading ? <Loading /> :
      <section className="h-screen md:h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col justify-center items-center">
        <Header isTurnX={game?.turn} />
        {sizeBoard === 3 ? (<TicTacToeBoard board={game?.board} onMove={onMove} />)
          : (<SumokuBoard board={game?.board} onMove={onMove} />)}
      </section>
  );
}

