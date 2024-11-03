import Header from "@components/game/Header";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import Loading from "@components/loading/Loading";
import useSocketConnect from "@hooks/useSocketConnect";
import useBotMode from "@hooks/useBotMode";
import usePvPMode from "@hooks/usePvPMode";
import ChessTimer from "./ChessTimer";
import IconBox from "@components/room/IconBox";




export default function Game() {
  const { isLoading }: { isLoading: boolean } = useSocketConnect();
  const sizeBoard = window?.game?.board.length;

  if (window.game === undefined) {
    window.location.href = "/room";
    return;
  }

  const { game, onMove } =
    window?.game?.players.filter((e) => {
      const name = e.user?.name;
      const index = name?.indexOf("BOT_");

      return index == -1 ? false : true;
    }).length > 0
      ? useBotMode()
      : usePvPMode();
  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center ">
      <ChessTimer game={game} initialTime={30} />
      <IconBox game={game} />
      <section className="w-[90%] lg:w-full overflow-auto flex">
        <div className="px-8"></div>
        {sizeBoard === 3 ? (
          <TicTacToeBoard board={game?.board} onMove={onMove} />
        ) : (
          <SumokuBoard board={game?.board} onMove={onMove} />
        )}
        <div className="px-8"></div>
      </section>
    </div>
  );
}
