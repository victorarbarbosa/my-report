import React, { useState } from "react";
import "./SignUp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/myreport-logo.svg";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [type, setType] = useState("user");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [userForm, setUserForm] = useState({
    name: "",
    secondName: "",
    email: "",
    cpf: "",
    phoneNumber: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    cnpj: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isCompany: true
  });

  // ---------------- VALIDAÇÕES ----------------
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateCPF = cpf => /^\d{11}$/.test(cpf.replace(/\D/g,""));
  const validateCNPJ = cnpj => /^\d{14}$/.test(cnpj.replace(/\D/g,""));
  const validatePhone = phone => /^\d{10,11}$/.test(phone.replace(/\D/g,""));
  const validatePassword = p => p.length >= 6;
  const validateDate = date => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  // ---------------- HANDLERS ----------------
  function handleUserChange(e) {
    setUserForm({...userForm, [e.target.name]: e.target.value});
  }

  function handleCompanyChange(e) {
    setCompanyForm({...companyForm, [e.target.name]: e.target.value});
  }

  // ---------------- VALIDAÇÕES FORM ----------------
  function validateUserForm() {
    let temp = {};
    if(!userForm.name) temp.name = "Nome é obrigatório.";
    if(!userForm.secondName) temp.secondName = "Sobrenome é obrigatório.";
    if(!userForm.email || !validateEmail(userForm.email)) temp.email = "Email inválido.";
    if(!userForm.cpf || !validateCPF(userForm.cpf)) temp.cpf = "CPF inválido.";
    if(!userForm.phoneNumber || !validatePhone(userForm.phoneNumber)) temp.phoneNumber = "Telefone inválido.";
    if(!userForm.birthDate || !validateDate(userForm.birthDate)) temp.birthDate = "Data inválida.";
    if(!validatePassword(userForm.password)) temp.password = "Senha mínima 6 caracteres.";
    if(userForm.password !== userForm.confirmPassword) temp.confirmPassword = "Senhas não coincidem.";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  }

  function validateCompanyForm() {
    let temp = {};
    if(!companyForm.name) temp.name = "Nome da empresa obrigatório.";
    if(!companyForm.cnpj || !validateCNPJ(companyForm.cnpj)) temp.cnpj = "CNPJ inválido.";
    if(!companyForm.email || !validateEmail(companyForm.email)) temp.email = "Email inválido.";
    if(!companyForm.phoneNumber || !validatePhone(companyForm.phoneNumber)) temp.phoneNumber = "Telefone inválido.";
    if(!validatePassword(companyForm.password)) temp.password = "Senha mínima 6 caracteres.";
    if(companyForm.password !== companyForm.confirmPassword) temp.confirmPassword = "Senhas não coincidem.";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  }

  // ---------------- SUBMIT ----------------
  async function handleSubmitUser(e) {
    e.preventDefault();
    if(!validateUserForm()) return;

    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    if(response.ok) setShowModal(true);
    else alert("Erro ao cadastrar.");
  }

  async function handleSubmitCompany(e) {
    e.preventDefault();
    if(!validateCompanyForm()) return;

    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    });

    if(response.ok) setShowModal(true);
    else alert("Erro ao cadastrar.");
  }

  function goToLogin() {
    setShowModal(false);
    navigate("/");
  }

  // ---------------- JSX ----------------
  return (
    <main className="initial">
      <div className="container-fluid">
        <div className="row">

          {/* Tela de apresentação */}
          <div className="col-md-5 d-none d-md-block presentation-div">
            <div className="presentation-content">
              <img className="logo" src={logo} alt="Logo"/>
              <p>
                MyReport é uma plataforma digital criada com o objetivo de fortalecer a segurança e a transparência nas relações online. 
                Inspirado em iniciativas como o ReclameAqui, o projeto permite que usuários denunciem golpes, fraudes e práticas enganosas...
              </p>
              <p>
                Além das denúncias, o MyReport permite que empresas e instituições respondam às ocorrências, apresentem soluções...
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="col-12 col-md-4 overflow-auto signup-overflow">
            <div className="form-header text-center">
              <h3 className="mb-3">Cadastre-se</h3>
              <div className="btn-group mb-4 w-100" role="group">
                <button
                  className={`btn ${type === "user" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setType("user")}
                >
                  Usuário
                </button>
                <button
                  className={`btn ${type === "company" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setType("company")}
                >
                  Empresa
                </button>
              </div>
            </div>

            {/* Form Usuário */}
            {type === "user" && (
              <form onSubmit={handleSubmitUser}>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input type="text" className="form-control" name="name" onChange={handleUserChange}/>
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Sobrenome</label>
                  <input type="text" className="form-control" name="secondName" onChange={handleUserChange}/>
                  {errors.secondName && <small className="text-danger">{errors.secondName}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" onChange={handleUserChange}/>
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">CPF</label>
                  <input type="text" className="form-control" name="cpf" onChange={handleUserChange}/>
                  {errors.cpf && <small className="text-danger">{errors.cpf}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de celular</label>
                  <input type="tel" className="form-control" name="phoneNumber" onChange={handleUserChange}/>
                  {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Data de nascimento</label>
                  <input type="date" className="form-control" name="birthDate" onChange={handleUserChange}/>
                  {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input type="password" className="form-control" name="password" onChange={handleUserChange}/>
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar senha</label>
                  <input type="password" className="form-control" name="confirmPassword" onChange={handleUserChange}/>
                  {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                </div>
                <button type="submit" className="btn btn-primary w-100 signup-button">Cadastrar Usuário</button>
              </form>
            )}

            {/* Form Empresa */}
            {type === "company" && (
              <form onSubmit={handleSubmitCompany}>
                <div className="mb-3">
                  <label className="form-label">Nome da empresa</label>
                  <input type="text" className="form-control" name="name" onChange={handleCompanyChange}/>
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">CNPJ</label>
                  <input type="text" className="form-control" name="cnpj" onChange={handleCompanyChange}/>
                  {errors.cnpj && <small className="text-danger">{errors.cnpj}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email corporativo</label>
                  <input type="email" className="form-control" name="email" onChange={handleCompanyChange}/>
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de contato</label>
                  <input type="tel" className="form-control" name="phoneNumber" onChange={handleCompanyChange}/>
                  {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input type="password" className="form-control" name="password" onChange={handleCompanyChange}/>
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar senha</label>
                  <input type="password" className="form-control" name="confirmPassword" onChange={handleCompanyChange}/>
                  {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                </div>
                <button type="submit" className="btn btn-primary w-100 signup-button">Cadastrar Empresa</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastro Realizado!</h5>
              </div>
              <div className="modal-body">
                <p>Seu cadastro foi concluído com sucesso.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={goToLogin}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}