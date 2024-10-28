import Header from "@components/game/Header";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import Loading from "@components/loading/Loading";
import useSocketConnect from "@hooks/useSocketConnect";
import useBotMode from "@hooks/useBotMode";
import usePvPMode from "@hooks/usePvPMode";
import { useEffect, useState } from "react";
import ChessTimer from "./ChessTimer";
export default function Game() {
  const { isLoading }: { isLoading: boolean } = useSocketConnect()
  const sizeBoard = window?.game?.board.length
  const [trigger, setTrigger] = useState(false)

  const { game, onMove } = window?.game?.players.filter(e => {
    const name = e.user?.name
    const index = name?.indexOf("BOT_")

    return index == -1 ? false : true
  }).length > 0
    ? useBotMode() : usePvPMode();

  // Timer component
  useEffect(() => {
    setTrigger(!trigger)
  }, [onMove, game])

  return (
    isLoading ? <Loading /> :
      <>
        <div> {trigger ? <ChessTimer game={game} initialTime={30}/> : <ChessTimer game={game} initialTime={30}/>} </div>
        <section className="h-screen md:h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col justify-center items-center">
          <Header isTurnX={game?.turn} />
          {sizeBoard === 3 ? (<TicTacToeBoard board={game?.board} onMove={onMove} />)
            : (<SumokuBoard board={game?.board} onMove={onMove} />)}
        </section>
      </>
  );

}

