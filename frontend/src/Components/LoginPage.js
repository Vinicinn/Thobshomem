import { useState } from "react";

function LoginPage({ socket, setLoggedIn }) {
  const [name, setName] = useState("");

  return (
    <>
      <div className="login-page">
        <div className="login-header">
          <h1>THOBSHOMEM</h1>
        </div>
        <div className="login-form">
          <h2>Nick/Apelido</h2>
          <p></p>
          <input
            type="text"
            value={name}
            placeholder="Digite seu nick/apelido"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => {
              socket.emit("join", name);
              setLoggedIn(true);
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
