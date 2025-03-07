import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("https://thobshomem.onrender.com");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return <div className="App">hello world</div>;
}

export default App;
