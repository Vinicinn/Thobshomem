import { useEffect, useState } from "react";

function LoginPage({ socket, setLoggedIn }) {
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setLoading(true);
    socket.emit("getRoles");
  };

  useEffect(() => {
    if (show) {
      socket.on("roles", (roles) => {
        setRoles(roles);
        setLoading(false);
      });
    }
  }, [socket, show]);

  return (
    <>
      <div className="login-page">
        <div className="login-header">
          <button className="info" onClick={handleShow}>
            ?
          </button>
          <h1 className="title">THOBSHOMEM</h1>
        </div>
        <div className="login-form">
          <h2>Nick/Apelido</h2>
          <p className="login-error"></p>
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
      {show && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal">
            <h2>Informações</h2>
            <hr style={{ borderBottom: "1px solid black" }}></hr>
            <p>
              THOBSHOMEM é um jogo inspirado no Wolvesville, também conhecido
              como lobisomem ou cidade dorme.
            </p>
            <p>
              O jogo começa com a distrubuição de funções para os jogadores em
              duas equipes, os Aldeões e os Lobisomens.
            </p>
            <p>
              O objetivo da Aldeia é descobrir quem são os infiltrados e
              eliminá-los para que todos sobrevivam.
            </p>
            <p>
              O objetivo dos Lobisomens é assassinar todos os Aldeões durante a
              noite e não serem descobertos.
            </p>
            <p>A equipe que sobreviver vence!</p>
            <p>O melhor jeito de aprender é jogando. Divirta-se!</p>
            <hr style={{ borderBottom: "1px solid black" }}></hr>
            <h2>Funções</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              roles.map((role) => (
                <div key={role.name}>
                  <h3>{role.name}</h3>
                  <p>{role.description}</p>
                  <p>Time: {role.team}</p>
                </div>
              ))
            )}
            <button onClick={handleClose}>fechar</button>
          </div>
        </div>
      )}
      <style>
        {`
          .login-page {
            width: 100vw;
            height: 90vh;
          }
          .login-header{
            flex-direction: column;
            align-items: center;
            display: flex;
            width: 100%;
            height: 10%;
          }
          .info {
            align-self: flex-start;
            margin: 10px;
          }
          .title {
            align-self: center;
          }
          .login-form {
            justify-content: center;
            flex-direction: column;
            align-items: center;
            display: flex;
            row-gap: 10px;
            width: 100%;
            height: 90%;
          }
          .login-error{
            color: red;
          }
          .modal-overlay {
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            position: fixed;
            display: flex;
            height: 100vh;
            width: 100vw;
            left: 0;
            top: 0;
          }
          .modal {
            background-color: white;
            text-align: center;
            max-height: 70%;
            overflow: auto;
            padding: 20px;
            width: 80%;
          }
          p, h2 {
          margin: 10px;
          }
        `}
      </style>
    </>
  );
}

export default LoginPage;
