import React, { useState } from "react";
import "./SignUp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/myreport-logo.svg";

export default function SignUp() {
  const [type, setType] = useState("user");

  const [errors, setErrors] = useState({});

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cpf: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    cnpj: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- VALIDAÇÕES BÁSICAS ----------------

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCPF = (cpf) =>
    /^\d{11}$/.test(cpf.replace(/\D/g, ""));

  const validateCNPJ = (cnpj) =>
    /^\d{14}$/.test(cnpj.replace(/\D/g, ""));

  const validatePhone = (phone) =>
    /^\d{10,11}$/.test(phone.replace(/\D/g, ""));

  const validatePassword = (p) =>
    p.length >= 6;

  const validateDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  // -------------- UPDATE HANDLERS --------------

  function handleUserChange(e) {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  function handleCompanyChange(e) {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  }

  // -------------------- VALIDATE USER --------------------

  function validateUserForm() {
    let temp = {};

    if (!userForm.firstName) temp.firstName = "Nome é obrigatório.";
    if (!userForm.lastName) temp.lastName = "Sobrenome é obrigatório.";

    if (!userForm.email || !validateEmail(userForm.email))
      temp.email = "Informe um email válido.";

    if (!userForm.cpf || !validateCPF(userForm.cpf))
      temp.cpf = "CPF inválido (somente números).";

    if (!userForm.phone || !validatePhone(userForm.phone))
      temp.phone = "Número de celular inválido.";

    if (!userForm.birthDate || !validateDate(userForm.birthDate))
      temp.birthDate = "Data de nascimento inválida.";

    if (!validatePassword(userForm.password))
      temp.password = "A senha deve ter pelo menos 6 caracteres.";

    if (userForm.password !== userForm.confirmPassword)
      temp.confirmPassword = "As senhas não coincidem.";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  }

  // -------------------- VALIDATE COMPANY --------------------

  function validateCompanyForm() {
    let temp = {};

    if (!companyForm.companyName)
      temp.companyName = "Nome da empresa é obrigatório.";

    if (!companyForm.cnpj || !validateCNPJ(companyForm.cnpj))
      temp.cnpj = "CNPJ inválido (somente números).";

    if (!companyForm.email || !validateEmail(companyForm.email))
      temp.email = "Informe um email válido.";

    if (!companyForm.phone || !validatePhone(companyForm.phone))
      temp.phone = "Número de contato inválido.";

    if (!validatePassword(companyForm.password))
      temp.password = "A senha deve ter pelo menos 6 caracteres.";

    if (companyForm.password !== companyForm.confirmPassword)
      temp.confirmPassword = "As senhas não coincidem.";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  }

  // -------------------- SUBMIT USER --------------------

  async function handleSubmitUser(e) {
    e.preventDefault();

    if (!validateUserForm()) return;

    const response = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    const data = await response.json();
    console.log("Usuário cadastrado:", data);
  }

  // -------------------- SUBMIT COMPANY --------------------

  async function handleSubmitCompany(e) {
    e.preventDefault();

    if (!validateCompanyForm()) return;

    const response = await fetch("http://localhost:8080/api/company/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    });

    const data = await response.json();
    console.log("Empresa cadastrada:", data);
  }

  // -------------------------------- UI --------------------------------

  return (
    <main className="initial">
      <div className="container-fluid">
        <div className="row">

          <div className="col-5 presentation-div d-none d-md-block">
            <div className="presentation-content">
              <img className="logo" src={logo} />
              <p>MyReport é uma plataforma digital...</p>
            </div>
          </div>

          <div className="overflow-auto signup-overflow col-4">
            <div className="form-header">
              <h3 className="mb-3">Cadastre-se</h3>

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

            {/* -------------------- FORM DE USUÁRIO -------------------- */}

            {type === "user" && (
              <form onSubmit={handleSubmitUser}>
                
                {/* NOME */}
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    className="form-control"
                    type="text"
                    name="firstName"
                    onChange={handleUserChange}
                  />
                  {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                </div>

                {/* SOBRENOME */}
                <div className="mb-3">
                  <label className="form-label">Sobrenome</label>
                  <input
                    className="form-control"
                    type="text"
                    name="lastName"
                    onChange={handleUserChange}
                  />
                  {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    onChange={handleUserChange}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                {/* CPF */}
                <div className="mb-3">
                  <label className="form-label">CPF</label>
                  <input
                    className="form-control"
                    type="text"
                    name="cpf"
                    onChange={handleUserChange}
                  />
                  {errors.cpf && <small className="text-danger">{errors.cpf}</small>}
                </div>

                {/* TELEFONE */}
                <div className="mb-3">
                  <label className="form-label">Número de celular</label>
                  <input
                    className="form-control"
                    type="tel"
                    name="phone"
                    onChange={handleUserChange}
                  />
                  {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>

                {/* DATA */}
                <div className="mb-3">
                  <label className="form-label">Data de nascimento</label>
                  <input
                    className="form-control"
                    type="date"
                    name="birthDate"
                    onChange={handleUserChange}
                  />
                  {errors.birthDate && <small className="text-danger">{errors.birthDate}</small>}
                </div>

                {/* SENHA */}
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={handleUserChange}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>

                {/* CONFIRM SENHA */}
                <div className="mb-3">
                  <label className="form-label">Confirmar senha</label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirmPassword"
                    onChange={handleUserChange}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">{errors.confirmPassword}</small>
                  )}
                </div>

                <button className="btn btn-primary w-100 signup-button" type="submit">
                  Cadastrar Usuário
                </button>
              </form>
            )}

            {/* -------------------- FORM DE EMPRESA -------------------- */}

            {type === "company" && (
              <form onSubmit={handleSubmitCompany}>
                
                {/* NOME EMPRESA */}
                <div className="mb-3">
                  <label className="form-label">Nome da empresa</label>
                  <input
                    className="form-control"
                    type="text"
                    name="companyName"
                    onChange={handleCompanyChange}
                  />
                  {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
                </div>

                {/* CNPJ */}
                <div className="mb-3">
                  <label className="form-label">CNPJ</label>
                  <input
                    className="form-control"
                    type="text"
                    name="cnpj"
                    onChange={handleCompanyChange}
                  />
                  {errors.cnpj && <small className="text-danger">{errors.cnpj}</small>}
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label">Email corporativo</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    onChange={handleCompanyChange}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                {/* TELEFONE */}
                <div className="mb-3">
                  <label className="form-label">Número de contato</label>
                  <input
                    className="form-control"
                    type="tel"
                    name="phone"
                    onChange={handleCompanyChange}
                  />
                  {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>

                {/* SENHA */}
                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={handleCompanyChange}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>

                {/* CONFIRM SENHA */}
                <div className="mb-3">
                  <label className="form-label">Confirmar senha</label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirmPassword"
                    onChange={handleCompanyChange}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">{errors.confirmPassword}</small>
                  )}
                </div>

                <button className="btn btn-primary w-100 signup-button" type="submit">
                  Cadastrar Empresa
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
