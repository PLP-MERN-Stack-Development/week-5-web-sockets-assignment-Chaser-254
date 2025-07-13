import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { UserProvider } from "./context/UserContext";
import { SocketProvider } from "./hooks/useSocket";

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
