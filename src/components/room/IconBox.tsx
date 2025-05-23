import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import socketService from "@app/socket/Socket";
import { Game } from "../interfaces/Game";
import User from "@app/user/User";

interface IUser {
  id: string;
  name: string;
}

interface IIconBoxComponentProps {
  game: Game;
}

const IconBox: React.FC<IIconBoxComponentProps> = ({ game }) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [myIcon, setMyIcon] = useState<string | null>(null);
  const [competitorIcon, setCompetitorIcon] = useState<string | null>(null);
  const [competitor, setCompetitor] = useState<User>();

  const [showIcons, setShowIcons] = useState(false);
  const emotionalIcons = [
    { key: "FaSmile", color: "yellow" },
    { key: "FaFrown", color: "gray" },
    { key: "FaAngry", color: "red" },
    { key: "FaSadCry", color: "24B9F9" },
    { key: "FaGrinHearts", color: "pink" },
  ];

  const handleAvatarClick = () => {
    setShowIcons(!showIcons);
  };

  const handleIconClick = (key: string) => {
    socketService.emit("throw_icon", {
      message: key,
      room_id: window?.room.id,
    });
  };

  useEffect(() => {
    const competitor: any | User = game.players.find(
      (player) =>
        player.user?.id !==
        JSON.parse(`${window.localStorage.getItem("user")}`).id
    )?.user;

    setCompetitor(competitor);
  }, [game]);

  useEffect(() => {
    const handleReceivedIcon = (payload: any) => {
      if (
        payload["user_id"] ===
        JSON.parse(`${window.localStorage.getItem("user")}`).id
      )
        setMyIcon(payload["message"]);
      else setCompetitorIcon(payload["message"]);
      const timeoutID = setTimeout(() => {
        setMyIcon(null);
        setCompetitorIcon(null);
      }, 2000);
      return () => clearTimeout(timeoutID);
    };
    socketService.listen("received_icon", handleReceivedIcon);
    return () => {
      socketService.offListener("received_icon", handleReceivedIcon);
    };
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      <div className="px-6 flex items-center gap-4 mb-4">
        <div className="flex flex-col items-center basis-1/2 shrink-0">
          {competitorIcon ? (
            <div className="text-green-500 mt-1">
              {React.createElement(FaIcons[competitorIcon], { size: 24 })}
            </div>
          ) : (
            <img
              src={
                "data:image/jpeg;base64,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"
              }
              alt="Competitor Avatar"
              className="cursor-pointer w-16 h-16 rounded-full"
              title="Click to throw icon"
            />
          )}
          <p className="line-clamp-1">{competitor?.name}</p>
        </div>
        <div className="flex flex-col items-center basis-1/2">
          {myIcon ? (
            <div className="text-green-500 mt-1">
              {React.createElement(FaIcons[myIcon], { size: 24 })}
            </div>
          ) : (
            <img
              src={
                "data:image/jpeg;base64,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"
              }
              alt="User Avatar"
              onClick={handleAvatarClick}
              className="cursor-pointer w-16 h-16 rounded-full"
              title="Click to throw icon"
            />
          )}
          <p>{"You"}</p>
        </div>
      </div>
      {showIcons && (
        <div className="flex flex-row gap-3 pb-5">
          {emotionalIcons.map(({ key, color }) => (
            <div
              key={key}
              onClick={() => handleIconClick(key)}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedIcon === key ? "bg-gray-300" : ""
              }`}
            >
              {React.createElement(FaIcons[key], {
                size: 24,
                style: { color },
              })}{" "}
              {/* Set icon color */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconBox;
