import { useSocket } from "../hooks/useSocket";

const MessageList = () => {
    const { messages } = useSocket();

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {messages.map((msg) => (
                <div className="mb-1" key={msg.id}>
                    <strong>{msg.sender}</strong>: {self.message} <span className="text-xs text-gray-500">({new Date(msg.timestamp).toLocaleTimeString()})</span>
                    {msg.isPrivate && <span className="ml-2 text-red-500">(private)</span>}
                </div>
            ))}
        </div>
    );
};

export default MessageList;