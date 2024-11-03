import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import Loading from "@components/loading/Loading";
import useSocketConnect from "@hooks/useSocketConnect";
import useBotMode from "@hooks/useBotMode";
import usePvPMode from "@hooks/usePvPMode";
import ChessTimer from "./ChessTimer";
import IconBox from "./IconBox";
export default function Game() {
  const { isLoading }: { isLoading: boolean } = useSocketConnect()
  const sizeBoard = window?.game?.board.length
  const { game, onMove } = window?.game?.players.filter(e => {
    const name = e.user?.name
    const index = name?.indexOf("BOT_")

    return index == -1 ? false : true
  }).length > 0
    ? useBotMode() : usePvPMode();
  return (
    isLoading ? <Loading /> :
      <>
        <ChessTimer game={game} initialTime={30} />
        <IconBox game={game} />
        <section className="h-screen md:h-[60vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col justify-center items-center -translate-y-16">
          {sizeBoard === 3 ? (<TicTacToeBoard board={game?.board} onMove={onMove} />)
            : (<SumokuBoard board={game?.board} onMove={onMove} />)}
        </section>
      </>
  );
}
