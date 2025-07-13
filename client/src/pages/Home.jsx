import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useSocket } from "../hooks/useSocket";

const Home = () => {
  const [name, setName] = useState("");

  const { login } = useUser();
  const { connect } = useSocket();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim()) {
      login(name);
      connect(name);
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Join BARAZA Chat</h1>
      <input
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"/>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleJoin}>
        Join
      </button>
    </div>
  );
};

export default Home;
