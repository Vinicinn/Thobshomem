import { Navigate } from "react-router-dom";

function GamePage({ socket, loggedIn }) {
  if (!loggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <p>pagina game</p>
    </>
  );
}

export default GamePage;
