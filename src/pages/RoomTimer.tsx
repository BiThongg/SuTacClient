import React, { useState, useEffect } from 'react';
import { Room } from "../interfaces/Room";
import { Player } from '@app/player/Player';
import Logo from '@components/shared/Logo';
import IconX from "@assets/icon-x.svg";
import IconO from "@assets/icon-o.svg";
import { Cell } from '@app/Utils';
import RingSpin from '@components/loading/ringspin';
import RoomClass from '@app/room/Room';

interface IRoomTimerProps {
  room: RoomClass;
}

const RoomTimer: React.FC<IRoomTimerProps> = ({ room }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(16);

    useEffect(() => {
        const createdDate = new Date(room.createdTime);
        const updateCountdown = () => {
            if (room.owner !== null && room.competitor !== null) {
              setRemainingSeconds(15);
            } else {
              const now = new Date();
              const elapsedSeconds = Math.floor((now - createdDate) / 1000);
              const newRemainingSeconds = Math.max(15 - elapsedSeconds, 0);
              setRemainingSeconds(newRemainingSeconds);
            }
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    }, [room]);

    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    const formattedTime = `${minutes}:${seconds}`;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg lg:-translate-y-16">
      <div className="text-4xl font-bold mb-4">
        {formattedTime}
      </div>
    </div>
  );
}

export default RoomTimer;
