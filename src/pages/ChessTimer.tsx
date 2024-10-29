import React, { useState, useEffect } from 'react';
import { Game } from "../interfaces/Game";
import { Player } from '@app/player/Player';
import Logo from '@components/shared/Logo';
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from '@app/Utils';
import RingSpin from '@components/loading/ringspin';

interface IChessTimerProps {
  game: Game;
  initialTime: number;
}

interface ICurrentState {
  title: string;
  currentSymbol: string;
}

const symbol = {
  X: <img src={IconX} className="w-6" />,
  O: <img src={IconO} className="w-6" />
}

const ChessTimer: React.FC<IChessTimerProps> = ({ game, initialTime }) => {
  const [mySelf, setMyself] = useState<Player>();
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [currentState, setCurrentState] = useState<ICurrentState>();

  useEffect(() => {
    setCurrentState({ title: mySelf?.symbol == game.turn ? "Your Turn" : "Opponent Turn", currentSymbol: game?.turn.valueOf() });
    resetTimer();
    return function cleanUpdateStateComponent() { };
  }, [game]);

  useEffect(() => {
    setMyself(game.players.find(player => player.user?.id === JSON.parse(`${window.localStorage.getItem('user')}`).id));
    setCurrentState({ title: mySelf?.symbol == game.turn ? "Your Turn" : "Competitor Turn", currentSymbol: game?.turn.valueOf() });
    return function cleanStartComponent() { };
  }, [mySelf]);


  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  };

  const formatTime = (time: any) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg lg:-translate-y-16">
      <Logo width={7} height={7} />
      <div className={"text-4xl font-bold mb-4 mt-2"}>
        {game.turn.valueOf() === mySelf?.symbol.valueOf() ? formatTime(timeLeft) : <span className='flex flex-row gap-3'><p>Waiting </p> < RingSpin /> </span>}
      </div>

      <div className="flex flex-row gap-3">
        {game.turn.valueOf() === mySelf?.symbol.valueOf() ? <div
          className="px-4 py-2 bg-green-500 text-black rounded-md"
        >
          {currentState?.title}
        </div> : <div
          className="px-4 py-2 bg-red-500 text-black rounded-md"
        >
          {currentState?.title}
        </div>}

        <div
          className="px-3 py-2 bg-black-300 text-white rounded-md flex"
        >
          <span className='flex flex-row gap-2'><p>Your Symbol: </p> {
            symbol[mySelf?.symbol]
          } </span>
        </div>
      </div>
    </div>
  );
}

export default ChessTimer;
