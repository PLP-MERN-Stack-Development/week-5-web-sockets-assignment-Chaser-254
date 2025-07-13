import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useUser } from "../context/UserContext";

const ChatRoom = () => {
  const { username } = useUser();
  const {
    sendMessage,
    setTyping,
    messages,
    users,
    typingUsers,
  } = useSocket();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      setTyping(false);
    };
  }, [setTyping]);

  const handleReaction = (msgId, reaction) => {
    console.log(`Reacted to message ${msgId} with ${reaction}`);
  };

  return (
    <div className="flex flex-col h-screen">
     
      <header className="bg-blue-600 text-white text-lg md:text-xl font-semibold p-4 shadow text-center">
        Baraza ChatRoom
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
     
        <div className="md:w-1/4 w-full bg-gray-100 p-4 border-r md:border-r">
          <h2 className="text-md md:text-lg font-semibold mb-2">Online Users</h2>
          <ul className="space-y-1">
            {users.map((user, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-1 ${
                  user === username ? "font-bold text-blue-600" : ""
                }`}
              >
                <span
                  className={`text-xs ${
                    typingUsers.includes(user)
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  ●
                </span>
                {user}
                {typingUsers.includes(user) && (
                  <span className="text-xs text-gray-500 ml-1">
                    (typing…)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

       
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                {msg.system ? (
                  <div className="text-center text-gray-500 text-sm">
                    {msg.message}
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold">{msg.sender}</span>{" "}
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>{msg.message}</span>
                      <div className="hidden group-hover:flex gap-1 text-sm">
                        <button
                          onClick={() => handleReaction(msg.id, "👍")}
                          className="hover:text-blue-500"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleReaction(msg.id, "❤️")}
                          className="hover:text-red-500"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicator */}
          {typingUsers.filter(u => u !== username).length > 0 && (
            <div className="px-4 text-sm text-gray-500 bg-gray-50 border-t">
              {typingUsers
                .filter((user) => user !== username)
                .join(", ")}{" "}
              {typingUsers.length > 1 ? "are" : "is"} typing...
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-2 md:p-4 border-t flex gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleTyping}
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              type="submit"
              className="px-3 md:px-4 py-1 bg-blue-500 text-white rounded"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
