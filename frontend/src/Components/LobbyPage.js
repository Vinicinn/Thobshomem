import { useEffect, useRef, useState } from "react";
import "./Lobby.css";
import { Navigate, useNavigate } from "react-router-dom";

function LobbyPage({ socket, loggedIn }) {
  const [players, setPlayers] = useState([]);
  const [ready, setReady] = useState(false);
  const [minPlayers, setMinPlayers] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [countDown, setCountDown] = useState(5);
  let intervalRef = useRef(null);
  const navigate = useNavigate();

  const handleChangeReady = () => {
    const newReady = !ready;
    setReady(newReady);
    socket.emit("readyChange", newReady);

    if (!newReady) {
      clearInterval(intervalRef);
      setCountDown(5);
    }
  };

  // SOCKET EFFECTS
  useEffect(() => {
    if (socket) {
      socket.emit("getPlayers");

      socket.on("players", (players) => {
        setPlayers(players);
        setMinPlayers(players.length >= 2);
      });

      socket.on("allReady", (value) => {
        setAllReady(value);
      });

      socket.on("gameId", (gameId) => {
        navigate(`/game/${gameId}`);
      });

      return () => {
        socket.off("players");
        socket.off("allReady");
        socket.off("gameId");
      };
    }
  }, [socket, navigate, allReady]);

  // COUNTDOWN EFFECTS
  useEffect(() => {
    if (allReady && minPlayers) {
      intervalRef.current = setInterval(() => {
        setCountDown((prevCountDown) => {
          if (prevCountDown === 0) {
            socket.emit("startGame");
          }
          return prevCountDown > 0 ? prevCountDown - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    if (!allReady || !minPlayers) {
      setCountDown(5);
    }
    return () => clearInterval(intervalRef.current);
  }, [allReady, minPlayers, socket]);

  if (!loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="lobby-page">
        <div className="lobby-header">
          <h1>Lobby</h1>
          <p>
            {minPlayers
              ? allReady
                ? `começando em ${countDown} segundos...`
                : "esperando todos ficarem prontos"
              : "é preciso 4 ou mais jogadores"}
          </p>
        </div>
        <div className="lobby-body">
          <h3>jogadores:</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name}
                {player.ready ? "✔️" : "❌"}
              </li>
            ))}
          </ul>
        </div>
        <div className="lobby-footer">
          <button onClick={handleChangeReady}>
            {ready ? "cancelar" : "pronto"}
          </button>
        </div>
      </div>
    </>
  );
}

export default LobbyPage;
