import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ReportDetails.css";
import Header from "./Header";
import perfil from "./assets/empty-profile-image.jpg";
import ReportCard from "./ReportCard";
import { jwtDecode } from "jwt-decode";
import useImageLoader from "./imageHelper";
import CommentItem from "./CommentItem";

export default function ReportDetails() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentImages, setCommentImages] = useState({});
    const [following, setFollowing] = useState([]);
    const [followingImages, setFollowingImages] = useState({});

    const token = localStorage.getItem("token");
    let loggedUserId = null;
    if (token) {
        const decoded = jwtDecode(token);
        loggedUserId = decoded.userId;
    }

    useEffect(() => {
        async function loadData() {
            const res = await fetch(`http://localhost:8080/api/report/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return; 
            }

            const data = await res.json();
            setReport(data);
            setComments(data.messages || []);
        }

        loadData();
    }, [id]);

    async function sendComment() {
        if (!newComment.trim()) return;

        await fetch("http://localhost:8080/api/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: new URLSearchParams({
                reportId: id,
                senderId: loggedUserId,
                message: newComment
            })
        });

        // adiciona o comentário na lista local
        setComments(prev => [
            ...prev,
            {
                userId: loggedUserId,
                senderFullName: jwtDecode(token).fullName,
                message: newComment
            }
        ]);

        setNewComment("");
    }

    useEffect(() => {
        async function loadFollowing() {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const loggedUserId = decoded.userId;

            const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}/following`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setFollowing(await response.json());
            }
        }

        loadFollowing();
    }, []);

    useEffect(() => {
        async function loadFollowingImages() {
            const token = localStorage.getItem("token");
            const images = {};
            for (const f of following) {
                try {
                    const response = await fetch(`http://localhost:8080/api/user/${f.id}/profile-image`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!response.ok) continue;
                    const blob = await response.blob();
                    images[f.id] = URL.createObjectURL(blob);
                } catch (err) {
                    images[f.id] = perfil;
                }
            }
            setFollowingImages(images);
        }

        if (following.length > 0) {
            loadFollowingImages();
        }
    }, [following]);

    function updateComment(updatedComment) {
        setComments(prev =>
            prev.map(c =>
                c.id === updatedComment.id ? updatedComment : c
            )
        );
    }

    if (!report) return null;

    return (
        <main>
            <Header />

            <div className="container-fluid">
                <div className="row">

                    {/* LATERAL ESQUERDA */}
                    <div className="overflow-auto following-overflow col-2">
                        <div className="mb-2"><b><span>Seguindo</span></b></div>
                        {following.map(f => (
                            <div 
                                key={f.id} 
                                className="following-user"
                                onClick={() => navigate(`/profile/${f.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img 
                                    src={followingImages[f.id] || perfil} 
                                    className='profile-image'
                                />
                                <b><span className='profile-name'>{f.name} {f.secondName}</span></b>
                            </div>
                        ))}
                    </div>

                    {/* CONTEÚDO PRINCIPAL */}
                    <div className="overflow-auto reports-overflow col-12 col-md-10">
                        <div className="report-container">

                            {/* POSTAGEM */}
                            <ReportCard key={id} post={report} />

                            {/* LISTA DE COMENTÁRIOS */}
                            <div className="comments-section mt-1">
                                <h5>Comentários</h5>

                                {/* Formulário de novo comentário */}
                                <div className="new-comment">
                                    <textarea
                                        className="comment-input"
                                        placeholder="Escreva um comentário..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button className="btn btn-primary mt-2" onClick={sendComment}>
                                        Enviar
                                    </button>
                                </div>

                                <hr />

                                {comments.length === 0 && (
                                    <p className="text-muted">Nenhum comentário ainda.</p>
                                )}

                                {comments.map((comment, index) => (
                                    <CommentItem key={index} comment={comment} token={token} onUpdate={updateComment}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}