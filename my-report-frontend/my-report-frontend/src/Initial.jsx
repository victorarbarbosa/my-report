import './Initial.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/myreport-logo.svg';
import { useNavigate } from "react-router-dom";

function Initial() {
  const navigate = useNavigate();

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
            <form className='px-5'>
              <input type="email" className="form-control" placeholder="Email" id="emailInput" aria-label="Email"/>
              <input type="password" className="form-control mt-3" placeholder="Senha" id="passwordInput" aria-label="Password"/>
              <div className='d-flex mt-3 justify-content-center gap-5 align-items-center form-options'>
                <a className='forget-password'>Esqueci minha senha</a>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/home");
                  }}
                >
                  Login
                </button>
              </div>
              <div className='signin-div d-flex flex-column justify-content-center'>
                <div className='divider'>
                  <span className='ou'>ou</span>
                </div>
                <button className='btn btn-primary mt-2'>Cadastre-se</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Initial
