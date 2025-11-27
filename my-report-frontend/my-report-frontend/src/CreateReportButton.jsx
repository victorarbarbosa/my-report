import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import "./CreateReportButton.css";
import { jwtDecode } from "jwt-decode";

export default function CreateReportButton({ onReportCreated }) {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [image, setImage] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [companySearch, setCompanySearch] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const token = localStorage.getItem("token");
    let loggedUserId = null;
    if (token) {
        const decoded = jwtDecode(token);
        loggedUserId = decoded.userId;
    }

    // 🔎 Carregar empresas quando abrir o modal
    useEffect(() => {
        if (!showModal) return;

        async function loadCompanies() {
            try {
                const res = await fetch("http://localhost:8080/api/user/company/default", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return; 
                }

                const data = await res.json();
                setCompanies(data);
                setFilteredCompanies(data);

            } catch (err) {
                console.error("Erro ao carregar empresas:", err);
            }
        }

        loadCompanies();
    }, [showModal]);

    // 🔎 Filtro da pesquisa de empresa
    useEffect(() => {
        const filtered = companies.filter(c =>
            c.name.toLowerCase().includes(companySearch.toLowerCase())
        );
        setFilteredCompanies(filtered);
    }, [companySearch, companies]);

    // 📤 Enviar denúncia
    async function handleCreateReport() {
        const reportData = {
            title,
            reportMessage,
            userId: loggedUserId,
            companyId: selectedCompanyId || null
        };

        const formData = new FormData();

        // Parte 1 → JSON (report)
        formData.append(
            "report",
            new Blob([JSON.stringify(reportData)], { type: "application/json" })
        );

        // Parte 2 → File (imagem)
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch("http://localhost:8080/api/report", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return; 
            }

            if (!response.ok) {
                console.error("Erro ao criar denúncia:", response.status);
                return;
            }

            const created = await response.json();

            if (onReportCreated) onReportCreated(created);
            setShowModal(false);

            // limpar modal
            setTitle("");
            setReportMessage("");
            setImage(null);
            setCompanySearch("");
            setSelectedCompanyId(null);

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    }

    return (
        <>
            {/* BOTÃO - ABRIR MODAL */}
            <div className="create-report" onClick={() => setShowModal(true)}>
                <FontAwesomeIcon icon={faSquarePlus} size="2x" className="me-3" />
                <h3 className="mt-1">Faça uma nova denúncia</h3>
            </div>

            {/* MODAL */}
            <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Nova Denúncia</h5>
                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>

                        <div className="modal-body">

                            {/* Título */}
                            <label className="form-label">Título</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            {/* Descrição */}
                            <label className="form-label">Descrição</label>
                            <textarea
                                className="form-control mb-3"
                                rows="4"
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                            ></textarea>

                            {/* Imagem */}
                            <label className="form-label">Imagem (opcional)</label>
                            <input
                                type="file"
                                className="form-control mb-3"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />

                            {/* Empresa */}
                            <label className="form-label">Empresa relacionada</label>
                            <input
                                type="text"
                                placeholder="Buscar empresa..."
                                className="form-control mb-2"
                                value={companySearch}
                                onChange={(e) => setCompanySearch(e.target.value)}
                            />

                            <select
                                className="form-select"
                                size={4}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                            >
                                {filteredCompanies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>

                            <button className="btn btn-primary" onClick={handleCreateReport}>
                                Criar Denúncia
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}