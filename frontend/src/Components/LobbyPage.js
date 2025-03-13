import { useEffect, useState } from "react";

function LobbyPage({ socket }) {
  const [players, setPlayers] = useState([]);
  const [ready, setReady] = useState(false);

  const handleChangeReady = () => {
    const newReady = !ready;
    setReady(newReady);
    socket.emit("readyChange", newReady);
  };

  useEffect(() => {
    socket.emit("getPlayers");

    socket.on("players", (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off("players");
    };
  }, [socket]);

  return (
    <>
      <div>
        <div>
          <h1>Lobby</h1>
          <p>é preciso 4 ou mais jogadores</p>
        </div>
        <div>
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
        <button onClick={handleChangeReady}>
          {ready ? "cancelar" : "pronto"}
        </button>
      </div>
    </>
  );
}

export default LobbyPage;
