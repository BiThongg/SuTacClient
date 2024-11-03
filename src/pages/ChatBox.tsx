import React, { useState, useEffect } from "react";
import socketService from "@app/socket/Socket";

interface IMessage {
  name: string;
  message: string;
  userId: string;
}

interface IChatBoxProps {
  currentUserId: string;
  roomId: string;
}

const ChatBox: React.FC<IChatBoxProps> = ({ currentUserId, roomId }) => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<IMessage[]>([]);

  useEffect(() => {
    socketService.listen("receive_message", (newMessage) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          name: newMessage.name,
          message: newMessage.message,
          userId: newMessage.user_id,
        },
      ]);

      const timeout = setTimeout(() => {
        const chatBox = document.querySelector(".h-80");
        chatBox?.scrollTo(0, chatBox.scrollHeight);
        clearTimeout(timeout);
      }, 100);
    });

    return () => {
      socketService.offListener("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { message, room_id: roomId };
      socketService.emit("send_message", newMessage);
      setMessage("");
    }
  };

  return (

    <div className="bg-black-300 w-[90%] p-5 max-w-md mx-auto rounded-lg">
      <div className="h-80 p-2 mb-4 overflow-y-auto rounded-lg">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.userId === currentUserId ? "justify-end" : "justify-start"
              } mb-2`}
          >
            <div
              className={`rounded-lg p-2 ${msg.userId === currentUserId
                ? "bg-blue-500 text-white max-w-xs text-right"
                : "bg-gray-200 text-gray-900 max-w-xs"
                }`}
            >
              <p className="text-sm font-semibold mb-1">
                {msg.userId === currentUserId ? "You" : msg.name}
              </p>
              <p className="break-all">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // set color for input when focus

          placeholder="Type a message"
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white rounded-r-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
