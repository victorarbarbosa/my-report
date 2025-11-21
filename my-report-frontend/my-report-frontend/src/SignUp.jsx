import React, { useState } from "react";
import "./SignUp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/myreport-logo.svg";

export default function SignUp() {
  const [type, setType] = useState("user");

  return (
    <main className="initial">
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 presentation-div d-none d-md-block">
            <div className="presentation-content">
              <img className="logo" src={logo} />
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

          <div className="overflow-auto signup-overflow col-4">
            <div className="form-header">
                <h3 className="mb-3">Cadastro</h3>

                <div className="btn-group mb-4">
                <button
                    className={`btn btn-${type === "user" ? "primary" : "outline-primary"}`}
                    onClick={() => setType("user")}
                >
                    Usuário
                </button>
                <button
                    className={`btn btn-${type === "company" ? "primary" : "outline-primary"}`}
                    onClick={() => setType("company")}
                >
                    Empresa
                </button>
                </div>
            </div>

            {type === "user" && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input className="form-control" type="text" placeholder="Seu nome" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sobrenome</label>
                  <input className="form-control" type="text" placeholder="Seu sobrenome" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" placeholder="Seu email" />
                </div>
                <div className="mb-3">
                  <label className="form-label">CPF</label>
                  <input className="form-control" type="password" placeholder="Seu CPF" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero de celular</label>
                  <input className="form-control" type="tel" placeholder="Seu celular" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Data de nascimento</label>
                  <input className="form-control" type="date" placeholder="Sua data de nascimento" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input className="form-control" type="password" placeholder="Sua senha" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar Senha</label>
                  <input className="form-control" type="password" placeholder="Confirme sua senha" />
                </div>
                <button className="btn btn-primary w-100 signup-button" type="submit">Cadastrar Usuário</button>
              </form>
            )}

            {type === "company" && (
              <form>
                <div className="mb-3">
                  <label className="form-label">Nome da Empresa</label>
                  <input className="form-control" type="text" placeholder="Nome da empresa" />
                </div>
                <div className="mb-3">
                  <label className="form-label">CNPJ</label>
                  <input className="form-control" type="text" placeholder="00.000.000/0000-00" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Corporativo</label>
                  <input className="form-control" type="email" placeholder="email@empresa.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Numero de contato</label>
                  <input className="form-control" type="tel" placeholder="Seu numero de contato" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input className="form-control" type="password" placeholder="Crie uma senha" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar Senha</label>
                  <input className="form-control" type="password" placeholder="Confirme sua senha" />
                </div>
                <button className="btn btn-primary w-100 signup-button" type="submit">Cadastrar Empresa</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
