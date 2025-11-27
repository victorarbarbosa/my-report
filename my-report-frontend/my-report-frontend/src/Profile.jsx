import React, { useEffect, useState } from "react";
import Header from "./Header";
import ReportCard from "./ReportCard";
import "./Profile.css";
import perfil from "./assets/empty-profile-image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCamera } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import CreateReportButton from "./CreateReportButton";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [newProfileImage, setNewProfileImage] = useState(null);

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: "",
        secondName: "",
        phoneNumber: "",
        email: ""
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordError, setPasswordError] = useState(null);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isFollowing, setIsFollowing] = useState(false);

    const token = localStorage.getItem("token");

    let loggedUserId = null;
    if (token) {
        const decoded = jwtDecode(token);
        loggedUserId = decoded.userId;
    }

    const { id } = useParams();
    const profileId = id ?? loggedUserId;  

    const isOwner = loggedUserId === profileId;

    async function fetchProfileImage(id) {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${id}/profile-image`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return; 
            }

            if (!response.ok) return perfil;

            const blob = await response.blob();
            return URL.createObjectURL(blob);

        } catch (error) {
            console.error("Erro ao carregar imagem:", error);
            return perfil;
        }
    }

    // ============================
    // Buscar dados do usuário
    // ============================
    useEffect(() => {
        if (!profileId) return;

        async function loadUserData() {
            try {
                const response = await fetch(`http://localhost:8080/api/user/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return; 
                }

                if (!response.ok) return;

                const data = await response.json();

                // agora busca a imagem real
                const imageUrl = await fetchProfileImage(profileId);

                setUser({
                    ...data,
                    profileImageUrl: imageUrl // ← adiciona a URL blob
                });

            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        }

        loadUserData();
    }, [profileId, token]);


    // ============================
    // Buscar reports
    // ============================
    useEffect(() => {
        if (!profileId) return;

        async function fetchReports() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/report/${profileId}/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return; 
                }

                if (!response.ok) {
                    console.error("Erro ao buscar reports:", response.status);
                    return;
                }

                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
            }
        }

        fetchReports();
    }, [profileId, token]);

    function openImageModal() {
        setShowImageModal(true);
    }

    async function handleUploadProfileImage() {
        if (!newProfileImage) return;

        const formData = new FormData();
        formData.append("file", newProfileImage);

        try {
            const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}/profile-image`, {
                method: "PUT",
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
                console.error("Erro ao atualizar imagem");
                return;
            }

            // Atualiza imagem no frontend sem precisar recarregar página
            const newImageUrl = await fetchProfileImage(loggedUserId);
            setUser(prev => ({ ...prev, profileImageUrl: newImageUrl }));

            setShowImageModal(false);

        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
        }
    }

    async function handleSaveProfileChanges() {
        // Validações básicas
        if (!editedUser.name) {
            return setEditedUser(prev => ({ ...prev, error: "O nome não pode estar vazio." }));
        }

        if (!editedUser.phoneNumber) {
            return setEditedUser(prev => ({ ...prev, error: "O telefone é obrigatório." }));
        }

        // Se usuário quiser trocar a senha
        if (editedUser.newPassword || editedUser.confirmNewPassword || editedUser.currentPassword) {

            if (!editedUser.currentPassword) {
                return setEditedUser(prev => ({ ...prev, error: "Informe a senha atual para alterar a senha." }));
            }

            if (editedUser.newPassword.length < 6) {
                return setEditedUser(prev => ({ ...prev, error: "A nova senha deve ter pelo menos 6 caracteres." }));
            }

            if (editedUser.newPassword !== editedUser.confirmNewPassword) {
                return setEditedUser(prev => ({ ...prev, error: "A nova senha e a confirmação não coincidem." }));
            }
        }

        setEditedUser(prev => ({ ...prev, error: null }));

        const body = {
            ...editedUser,
            passwordUpdate: {
                currentPassword: editedUser.currentPassword,
                newPassword: editedUser.newPassword
            }
        };

        const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return; 
        }

        if (response.ok) {
            const updated = await response.json();
            setUser(updated);
        } else {
            setEditedUser(prev => ({ ...prev, error: "Falha ao atualizar o perfil." }));
            return;
        }

        setShowEditProfileModal(false);
    }

    async function handlePasswordChange() {
        if (!passwordData.currentPassword)
            return setPasswordError("Informe a senha atual.");

        if (passwordData.newPassword.length < 6)
            return setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");

        if (passwordData.newPassword !== passwordData.confirmPassword)
            return setPasswordError("A confirmação não coincide.");

        setPasswordError(null);

        const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}/password`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                actualPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
        });

        if (!response.ok) {


            if(response.status === 400) {
                setPasswordError("Senha atual informada não coincide")
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return; 
            }else {
                setPasswordError("Erro ao alterar senha.");
            }

            return;
        }

        setShowPasswordModal(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    }

    useEffect(() => {
        async function checkFollow() {
            if (profileId === loggedUserId) return;

            const response = await fetch(`http://localhost:8080/api/user/${id}/${loggedUserId}/is-following`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                setIsFollowing(result);
            }
        }

        checkFollow();
    }, [profileId]);

    async function toggleFollow() {
        const method = isFollowing ? "DELETE" : "POST";

        const response = await fetch(`http://localhost:8080/api/user/${id}/${loggedUserId}/follow`, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        if (response.ok) {
            setIsFollowing(!isFollowing);
        }
    }

    function addNewPostToList(report) {
        setReports(prev => [report, ...prev]);
    }

    return (
        <main className="profile-main">
            <Header />

            <div className="container profile-container">
                <div className="row">
                    {/* =================================== */}
                    {/* CARD DO USUÁRIO */}
                    {/* =================================== */}
                    <div className="col-12 col-md-4 mb-4">
                        <div className="user-info-card shadow-sm">

                            {/* IMAGEM DE PERFIL */}
                           <div className="profile-image-wrapper">
                                <img 
                                    src={user?.profileImageUrl || perfil} 
                                    alt="Foto de Perfil" 
                                    className="big-profile-image" 
                                />

                                {isOwner && (
                                    <button className="edit-image-btn" onClick={openImageModal}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                )}
                            </div>

                            {/* NOME */}
                            <h2 className="user-name">
                                {`${user?.name ?? ""} ${user?.secondName ?? ""}`}
                            </h2>

                            {/* EMAIL */}
                            <p className="user-email text-muted">{user?.email}</p>

                            {/* CPF ou CNPJ */}
                            {user?.company ? (
                                <p className="text-muted">CNPJ: {user?.cnpj}</p>
                            ) : (
                                <p className="text-muted">CPF: {user?.cpf}</p>
                            )}

                            {/* Telefone */}
                            <p className="text-muted">Celular: {user?.phoneNumber}</p>

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{reports.length}</span>
                                    <span className="stat-label">Denúncias</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">45</span>
                                    <span className="stat-label">Apoiadores</span>
                                </div>
                            </div>

                            {/* BOTÕES DE AÇÃO */}
                            {isOwner ? (
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={() => {
                                        setEditedUser({
                                            name: user?.name,
                                            secondName: user?.secondName,
                                            phoneNumber: user?.phoneNumber,
                                            email: user?.email
                                        });
                                        setShowEditProfileModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
                                    Editar Perfil
                                </button>
                            ) : (
                                !isOwner && (
                                    <button 
                                        className={`btn w-100 ${isFollowing ? "btn-outline-danger" : "btn-outline-primary"}`}
                                        onClick={toggleFollow}
                                    >
                                        {isFollowing ? "Deixar de Seguir" : "Seguir Usuário"}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* =================================== */}
                    {/* LISTA DE REPORTS */}
                    {/* =================================== */}
                    <div className="col-12 col-md-8 user-reports-section">
                        <h3 className="section-title">Minhas Denúncias</h3>

                        <CreateReportButton onReportCreated={addNewPostToList} />

                        {reports.length === 0 ? (
                            <p className="text-muted">
                                Este usuário ainda não cadastrou denúncias.
                            </p>
                        ) : (
                            reports.map((post) => (
                                <ReportCard key={post.id} post={post} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ===================== MODAL: Editar Imagem ===================== */}
            <div className={`modal fade ${showImageModal ? "show d-block" : ""}`} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                <div className="modal-header">
                    <h5 className="modal-title">Alterar imagem de perfil</h5>
                    <button
                    className="btn-close"
                    onClick={() => setShowImageModal(false)}
                    ></button>
                </div>

                <div className="modal-body">
                    <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setNewProfileImage(e.target.files[0])}
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>
                    Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleUploadProfileImage}>
                    Salvar imagem
                    </button>
                </div>

                </div>
            </div>
            </div>

            {showImageModal && <div className="modal-backdrop fade show"></div>}

            {/* ===================== MODAL: Editar Perfil ===================== */}
            <div className={`modal fade ${showEditProfileModal ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Editar Perfil</h5>
                            <button className="btn-close" onClick={() => setShowEditProfileModal(false)}></button>
                        </div>

                        <div className="modal-body">

                            {/* Mensagem de erro geral */}
                            {editedUser.error && (
                                <div className="alert alert-danger py-2">{editedUser.error}</div>
                            )}

                            {/* Nome */}
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editedUser.name}
                                onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                            />

                            {/* Sobrenome */}
                            <label className="form-label">Sobrenome</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editedUser.secondName}
                                onChange={(e) => setEditedUser(prev => ({ ...prev, secondName: e.target.value }))}
                            />

                            {/* Email */}
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control mb-2"
                                value={editedUser.email}
                                onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                            />

                            {/* Telefone */}
                            <label className="form-label">Telefone</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editedUser.phoneNumber}
                                onChange={(e) => setEditedUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowEditProfileModal(false)}>
                                Cancelar
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {setShowEditProfileModal(false); setShowPasswordModal(true);}}
                            >
                                Alterar Senha
                            </button>

                            <button className="btn btn-primary" onClick={handleSaveProfileChanges}>
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEditProfileModal && <div className="modal-backdrop fade show"></div>}

            {/* ===================== MODAL: Alterar Senha ===================== */}
            <div className={`modal fade ${showPasswordModal ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Alterar Senha</h5>
                            <button
                                className="btn-close"
                                onClick={() => setShowPasswordModal(false)}
                            ></button>
                        </div>

                        <div className="modal-body">

                            {passwordError && (
                                <div className="alert alert-danger">{passwordError}</div>
                            )}

                            <label className="form-label">Senha Atual</label>
                            <input
                                type="password"
                                className="form-control mb-2"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))
                                }
                            />

                            <label className="form-label">Nova Senha</label>
                            <input
                                type="password"
                                className="form-control mb-2"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                                }
                            />

                            <label className="form-label">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                className="form-control mb-2"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                                }
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                                Cancelar
                            </button>

                            <button className="btn btn-primary" onClick={handlePasswordChange}>
                                Atualizar Senha
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && <div className="modal-backdrop fade show"></div>}
        </main>
    );
}
