import { useEffect, useState, createContext, useContext } from 'react';
import socket from '../socket/socket';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const connect = (username) => {
    socket.connect();

    if (socket.connected) {
      socket.emit("user_join", username);
    } else {
      socket.once("connect", () => {
        socket.emit("user_join", username);
      });
    }
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const sendMessage = (message) => {
    socket.emit("send_message", { message });
  };

  const sendPrivateMessage = (to, message) => {
    socket.emit("private_message", { to, message });
  };

  const setTyping = (isTyping) => {
    socket.emit("typing", isTyping);
  };

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handlePrivateMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserList = (userList) => setUsers(userList);

    const handleUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const handleUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const handleTypingUsers = (typing) => setTypingUsers(typing);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleMessage);
    socket.on('private_message', handlePrivateMessage);
    socket.on('user_list', handleUserList);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('typing_users', handleTypingUsers);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleMessage);
      socket.off('private_message', handlePrivateMessage);
      socket.off('user_list', handleUserList);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('typing_users', handleTypingUsers);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connect,
        disconnect,
        sendMessage,
        sendPrivateMessage,
        setTyping,
        messages,
        users,
        typingUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
