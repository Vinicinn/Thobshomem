import { useEffect, useState } from "react";

function LobbyPage({ socket }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.emit("getPlayers");

    socket.on("players", (players) => {
      setPlayers(players);
      console.log(players);
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
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default LobbyPage;
