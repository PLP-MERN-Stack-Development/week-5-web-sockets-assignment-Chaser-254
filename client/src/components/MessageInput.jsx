import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useUser } from "../context/UserContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, setTyping } = useSocket();
  const { username } = useUser();

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
      setTyping(false);
    }
  };

  return (
    <div className="flex p-2 bg-white">
      <input
        className="flex-1 border p-2 rounded"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setTyping(e.target.value.length > 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
