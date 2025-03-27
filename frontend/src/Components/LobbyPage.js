import { useEffect, useState } from "react";
import "./Lobby.css";
import { Navigate, useNavigate } from "react-router-dom";

function LobbyPage({ socket, loggedIn }) {
  const [players, setPlayers] = useState([]);
  const [ready, setReady] = useState(false);
  const [minPlayers, setMinPlayers] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [countDown, setCountDown] = useState(null);
  const navigate = useNavigate();

  const handleChangeReady = () => {
    const newReady = !ready;
    setReady(newReady);
    socket.emit("readyChange", newReady);
  };

  useEffect(() => {
    socket.emit("getPlayers");

    socket.on("players", (players) => {
      setPlayers(players);
      if (players.length >= 2) {
        setMinPlayers(true);
      }
    });

    socket.on("allReady", (value) => {
      setAllReady(value);
    });

    socket.on("gameId", (gameId) => {
      navigate(`/game/${gameId}`);
    });

    if (allReady) {
      let timeLeft = 5;
      setCountDown(timeLeft);
      const countDownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountDown(timeLeft);
        if (timeLeft === 0) {
          clearInterval(countDownInterval);
          socket.emit("startGame");
        }
      }, 1000);
    }

    return () => {
      socket.off("players");
    };
  }, [socket, allReady, navigate]);

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
                {player.ready ? " (pronto)" : " (nao pronto)"}
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
