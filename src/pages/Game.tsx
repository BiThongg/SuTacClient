import Header from "@components/game/Header";
import TicTacToeBoard from "@components/game/TictactoeBoard";
import SumokuBoard from "@components/game/SumokuBoard";
import Loading from "@components/loading/Loading";
import useSocketConnect from "@hooks/useSocketConnect";
import useBotMode from "@hooks/useBotMode";
import usePvPMode from "@hooks/usePvPMode";
import ChessTimer from "./ChessTimer";
import IconBox from "@components/room/IconBox";
import { useEffect } from "react";
import socketService from "@app/socket/Socket";

export default function Game() {
  const { isLoading }: { isLoading: boolean } = useSocketConnect();
  const sizeBoard = window?.game?.board.length;

  useEffect(() => {
    const handleDetectedCheating = (data: { message: string }) => {
      const alert = document.createElement('div');
      alert.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      alert.textContent = data.message;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    };

    const handleDetectedAnomaly = (data: { message: string }) => {
      const alert = document.createElement('div');
      alert.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      alert.textContent = data.message;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    };

    const handleDetectedSpamming = (data: { message: string }) => {
      const alert = document.createElement('div');
      alert.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      alert.textContent = data.message;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    };

    socketService.listen('detected_cheating', handleDetectedCheating);
    socketService.listen('detected_anomaly', handleDetectedAnomaly);
    socketService.listen('detected_spamming', handleDetectedSpamming);

    return () => {
      socketService.removeListener('detected_cheating', handleDetectedCheating);
      socketService.removeListener('detected_anomaly', handleDetectedAnomaly);
      socketService.removeListener('detected_spamming', handleDetectedSpamming);
    };
  }, []);

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
      <section className="w-[90vw] overflow-auto flex">
        {/* <div className="px-8"></div> */}
        {sizeBoard === 3 ? (
          <TicTacToeBoard board={game?.board} onMove={onMove} />
        ) : (
          <SumokuBoard board={game?.board} onMove={onMove} />
        )}
        {/* <div className="px-8"></div> */}
      </section>
    </div>
  );
}
