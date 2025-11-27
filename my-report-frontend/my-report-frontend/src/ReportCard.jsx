import React, { useState, useEffect } from "react";
import "./ReportCard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faCircleArrowDown, faComment } from '@fortawesome/free-solid-svg-icons';
import useImageLoader from "./imageHelper";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function ReportCard({ post }) {
    const navigate = useNavigate();
    const [votes, setVotes] = useState(post.upvoteNumber);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedMessage, setEditedMessage] = useState(post.reportMessage);
    const [editedCompanyId, setEditedCompanyId] = useState(post.companyId);
    const [editedImage, setEditedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [localPost, setLocalPost] = useState(post);
    const [isResolved, setIsResolved] = useState(post.resolved);

    const [companyList, setCompanyList] = useState([]);

    const token = localStorage.getItem("token");
    let loggedUserId = null;
    if (token) {
        const decoded = jwtDecode(token);
        loggedUserId = decoded.userId;
    }

    const authorImage = useImageLoader(`http://localhost:8080/api/user/${localPost.userId}/profile-image`, token);
    const targetImage = useImageLoader(`http://localhost:8080/api/user/${localPost.companyId}/profile-image`, token);
    const reportImage = useImageLoader(`http://localhost:8080/api/report/${localPost.id}/report-image`, token);

    async function sendVote(type) {
        const endpoint = `http://localhost:8080/api/report/${localPost.id}/${type}`;
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "userId": loggedUserId
                }
            });

            if (!res.ok) {
                if (res.status === 404) return null;
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return; 
                }
                return;
            }

            const updated = await res.json();
            setVotes(updated.upvoteNumber);

        } catch (err) {
            console.error("Erro ao votar:", err);
        }
    }

    async function savePostEdit() {
        const formData = new FormData();
        formData.append("userId", loggedUserId);
        formData.append("title", editedTitle);
        formData.append("message", editedMessage);
        formData.append("companyId", editedCompanyId);

        if (editedImage) {
            formData.append("image", editedImage);
        }

        const res = await fetch(`http://localhost:8080/api/report/${localPost.id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return; 
        }

        if (res.ok) {
            setShowEditModal(false);
            setLocalPost(prev => ({
                ...prev,
                title: editedTitle,
                reportMessage: editedMessage,
                companyId: editedCompanyId,
                companyName: companyList.find(c => c.id == editedCompanyId)?.name || prev.companyName,
                reportImage: editedImage
            }));
        }
    }

    useEffect(() => {
        async function loadCompanies() {
            const res = await fetch("http://localhost:8080/api/user/company/default", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return; 
            }

            setCompanyList(await res.json());
        }

        loadCompanies();
    }, []);

    async function resolvePost() {
        const res = await fetch(`http://localhost:8080/api/report/${localPost.id}/resolve`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "userId": loggedUserId
            }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return; 
        }

        if (res.ok) {
            setIsResolved(true);
            setLocalPost(prev => ({ ...prev, resolved: true }));
        }
    }

    function openComments() {
        navigate(`/report/${localPost.id}`);
    }

    return (
        <div className="report p-3 border rounded mb-3">

            {/* Profile Section */}
            <div className="profile-section d-flex flex-wrap align-items-center mb-2">
                <div className="profile-icon d-flex align-items-center me-3 mb-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${localPost.userId}`)}>
                    <img src={authorImage} className='profile-image' alt="autor" />
                    <b className="ms-2">{localPost.userFullName}</b>
                </div>

                <span className="me-3 mb-2">Para:</span>

                <div className="profile-icon d-flex align-items-center mb-2" style={{ cursor: "pointer" }} onClick={() => navigate(`/profile/${localPost.companyId}`)}>
                    <img src={targetImage} className='profile-image' alt="destinatário" />
                    <b className="ms-2">{localPost.companyName}</b>
                </div>
            </div>

            {/* Buttons / Badge */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                {localPost.userId === loggedUserId && (
                    <>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowEditModal(true)}>✏️ Editar</button>
                        {!isResolved && <button className="btn btn-sm btn-success" onClick={resolvePost}>✔️ Resolver</button>}
                    </>
                )}
                {isResolved && <span className="badge bg-success">✔ Resolvido</span>}
            </div>

            {/* Title & Message */}
            <h4 className="report-title mt-2">{localPost.title}</h4>
            <p className="mt-2 mb-3">{localPost.reportMessage}</p>

            {/* Post Image */}
            {reportImage && (
                <div className="report-image-frame mb-3">
                    <img src={reportImage} alt="imagem da postagem" className="img-fluid rounded" />
                </div>
            )}

            {/* Votes & Comments */}
            <div className="report-options d-flex flex-wrap align-items-center gap-3">
                <div className="upvote d-flex align-items-center gap-1">
                    <FontAwesomeIcon icon={faCircleArrowUp} onClick={() => sendVote("upvote")} />
                    <span className="upvote-number">{votes}</span>
                    <FontAwesomeIcon icon={faCircleArrowDown} onClick={() => sendVote("downvote")} />
                </div>

                <div className="comment d-flex align-items-center gap-1" onClick={openComments} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faComment} />
                    <span className="comments-number">{localPost.messages?.length ?? 0}</span>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal fade show d-block" style={{ background: "#00000090" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Postagem</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="mt-2">Título</label>
                                <input type="text" className="form-control" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} />

                                <label className="mt-3">Mensagem</label>
                                <textarea className="form-control" value={editedMessage} onChange={e => setEditedMessage(e.target.value)} />

                                <label className="mt-3">Empresa Destinatária</label>
                                <select className="form-control" value={editedCompanyId} onChange={e => setEditedCompanyId(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {companyList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>

                                <label className="mt-3">Imagem da Postagem</label>
                                <input type="file" className="form-control" accept="image/*" onChange={e => {
                                    setEditedImage(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                                {preview && <img src={preview} alt="preview" className="img-fluid mt-3 rounded" />}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={savePostEdit}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}