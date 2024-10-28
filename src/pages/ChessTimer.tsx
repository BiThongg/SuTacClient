import React, { useState, useEffect } from 'react';
import { Game } from "../interfaces/Game";
import { Player } from '@app/player/Player';

interface IChessTimerProps {
  game: Game;            
  initialTime: number;
}

interface ICurrentState {
  title: string;
  currentSymbol: string;
}

const ChessTimer: React.FC<IChessTimerProps> = ({game, initialTime}) => {
  const [mySelf, setMyself] = useState<Player>();
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [currentState, setCurrentState] = useState<ICurrentState>();
  
  useEffect(() => {
    setCurrentState({title: mySelf?.symbol == game.turn ? "My Turn" : "Competitor Turn", currentSymbol: game?.turn.valueOf()});
    resetTimer();
    return function cleanUpdateStateComponent() {};
  }, [game]);

  useEffect(() =>  {
    setMyself(game.players.find(player => player.user?.id === JSON.parse(`${window.localStorage.getItem('user')}`).id));
    setCurrentState({title: mySelf?.symbol == game.turn ? "My Turn" : "Competitor Turn", currentSymbol: game?.turn.valueOf()});
    return function cleanStartComponent() {};
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

  // util functon
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
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Chess Timer</h2>
      <div className="text-4xl font-bold mb-4">
        {game.turn.valueOf() === mySelf?.symbol.valueOf()? formatTime(timeLeft) : "Waiting"  }
      </div>
      <div className="flex space-x-4">
        {game.turn.valueOf() === mySelf?.symbol.valueOf()? <button 
          className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-yellow-600 transition"
        >
          {currentState?.title}
        </button> : <button 
          className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-yellow-600 transition"
        >
          {currentState?.title}
        </button>}
        
        <button 
          // onClick={resetTimer} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-red-600 transition"
        >
          `Your Symbol ${mySelf?.symbol.valueOf()}`
        </button>
      </div>
    </div>
  );
}

export default ChessTimer;