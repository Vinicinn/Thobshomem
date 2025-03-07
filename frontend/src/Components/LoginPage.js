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
            onClick={async () => {
              try {
                const response = await socket
                  .timeout(5000)
                  .emitWithAck("join", name);
                if (response.success) {
                  setLoggedIn(true);
                } else {
                  document.getElementsByTagName("p")[0].innerText =
                    response.message;
                }
              } catch (error) {
                console.log(error);
              }
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
