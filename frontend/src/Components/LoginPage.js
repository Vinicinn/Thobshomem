function LoginPage({ setLoggedIn }) {
  return (
    <>
      <div className="login-page">
        <div className="login-header">
          <h1>THOBSHOMEM</h1>
        </div>
        <div className="login-form">
          <h2>Nick/Apelido</h2>
          <p></p>
          <input type="text" placeholder="Digite seu nick/apelido" />
          <button onClick={() => setLoggedIn(true)}>Entrar</button>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
