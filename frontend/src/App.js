// IMPORTS
import { useEffect, useState } from "react";
import io from "socket.io-client";

// COMPONENTS
import LoginPage from "./Components/LoginPage.js";
import LobbyPage from "./Components/LobbyPage.js";

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
      {loggedIn ? (
        <LobbyPage socket={socket} />
      ) : (
        <LoginPage socket={socket} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;
