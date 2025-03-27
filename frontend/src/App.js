// IMPORTS
import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// COMPONENTS
import LoginPage from "./Components/LoginPage.js";
import LobbyPage from "./Components/LobbyPage.js";
import GamePage from "./Components/GamePage.js";

function App() {
  const [socket, setSocket] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const newSocket = io("https://thobshomem.onrender.com");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <div className="App">
      <Router basename="/Thobshomem">
        <Routes>
          <Route
            path="/"
            element={<LoginPage socket={socket} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/lobby"
            element={
              loggedIn ? <LobbyPage socket={socket} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/game/:gameId"
            element={loggedIn ? <GamePage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
