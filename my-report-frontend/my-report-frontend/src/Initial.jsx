import './Initial.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/myreport-logo.svg';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function Initial() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Recuperação de senha
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setErrorMsg("Credenciais inválidas.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Salva o JWT
      localStorage.setItem("token", data.token);

      // Redireciona
      navigate("/home");

    } catch (error) {
      console.error("Erro ao logar:", error);
      setErrorMsg("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function sendRecoveryEmail() {
    setResetMsg("");
    setResetError("");

    if (!resetEmail) {
      setResetError("Digite um email válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });

      if (!response.ok) {
        setResetError("Email não encontrado.");
        return;
      }

      setShowCodeInput(true);
      setResetMsg("Código enviado para seu email!");
    } catch (e) {
      setResetError("Erro ao enviar código.");
    }
  }

  async function resetPassword() {
    setResetMsg("");
    setResetError("");

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          token: resetCode,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        setResetError("Código inválido ou expirado.");
        return;
      }

      setResetMsg("Senha alterada com sucesso!");
    } catch (e) {
      setResetError("Erro ao alterar senha.");
    }
  }

  return (
    <main className='initial'>
      <div className='container initial-container'>
        <div className='row content-row'>
          <div className='col-md-6 presentation-div d-none d-md-block'>
            <div className='presentation-content'>
              <img className='logo' src={logo}/>
              <p>
                MyReport é uma plataforma digital criada com o objetivo de fortalecer a segurança e a transparência nas relações online. 
                Inspirado em iniciativas como o ReclameAqui, o projeto permite que usuários denunciem golpes, fraudes e práticas enganosas, compartilhando 
                suas experiências para alertar outras pessoas. A proposta central é oferecer um ambiente confiável, colaborativo e acessível, onde qualquer 
                pessoa possa contribuir para uma internet mais segura.
              </p>
              <p>
                Além das denúncias, o MyReport permite que empresas e instituições respondam às ocorrências, apresentem soluções e mostrem comprometimento 
                com a reputação digital. Essa interação direta estimula a confiança e o diálogo entre consumidores e organizações, ajudando a restaurar a 
                credibilidade de marcas legítimas e a identificar práticas suspeitas com mais rapidez e precisão.
              </p>
            </div>
          </div>

          <div className='col-md-6 login-div d-flex flex-column justify-content-center text-center'>
            <img className='logo d-block d-md-none' src={logo} />
            <h1 className='mb-4'>Faça seu Login</h1>

            {errorMsg && <p className="text-danger">{errorMsg}</p>}

            <form className='px-5' onSubmit={handleLogin}>
              
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input 
                type="password" 
                className="form-control mt-3" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className='d-flex mt-3 justify-content-center gap-5 align-items-center form-options'>
                <a 
                  className='forget-password'
                  data-bs-toggle="modal"
                  data-bs-target="#forgotModal"
                >
                  Esqueci minha senha
                </a>
                <button 
                  type="submit"
                  className="btn btn-success"
                >
                  {loading ? "Aguarde..." : "Login"}
                </button>
              </div>
              <div className='signin-div d-flex flex-column justify-content-center'>
                <div className='divider'>
                  <span className='ou'>ou</span>
                </div>
                <button className='btn btn-primary mt-2' onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}>Cadastre-se</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de esqueci senha */}
      <div className="modal fade" id="forgotModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Recuperar Senha</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">

              {!showCodeInput && (
                <div>
                  <label>Email cadastrado:</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Digite seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              )}

              {showCodeInput && (
                <div>
                  <label>Código recebido:</label>
                  <input 
                    className="form-control" 
                    placeholder="Digite o código"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />

                  <label className="mt-3">Nova senha:</label>
                  <input 
                    type="password"
                    className="form-control" 
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              )}

              {resetMsg && <p className="text-success mt-3">{resetMsg}</p>}
              {resetError && <p className="text-danger mt-3">{resetError}</p>}

            </div>

            <div className="modal-footer">
              {!showCodeInput ? (
                <button className="btn btn-primary" onClick={sendRecoveryEmail}>
                  Enviar código
                </button>
              ) : (
                <button className="btn btn-success" onClick={resetPassword}>
                  Alterar senha
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default Initial
