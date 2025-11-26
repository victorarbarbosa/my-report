import React, { useEffect, useState } from "react";
import Header from "./Header";
import ReportCard from "./ReportCard";
import CreateReportButton from "./CreateReportButton";
import perfil from './assets/empty-profile-image.jpg';
import "./Home.css";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Home() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    const [followingImages, setFollowingImages] = useState({});

    useEffect(() => {
        async function loadPosts() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:8080/api/report/recent", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    console.error("Erro ao carregar posts:", response.status);
                    return;
                }

                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Erro ao carregar posts:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, [navigate]);

    useEffect(() => {
        async function loadFollowing() {
            const token = localStorage.getItem("token");
            if (!token) return;
            const decoded = jwtDecode(token);
            const loggedUserId = decoded.userId;

            const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}/following`, {
                headers: { "Authorization": `Bearer ${token}` }
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

    function addNewPostToList(report) {
        setPosts(prev => [report, ...prev]);
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <main>
            <Header />

            <div className="container-fluid home-container">
                <div className="row">

                    {/* Coluna de seguidores - aparece apenas em md+ */}
                    <div className="d-none d-md-block col-md-2 overflow-auto following-overflow">
                        <div className="mb-2"><b>Seguindo</b></div>
                        {following.map(f => (
                            <div
                                key={f.id}
                                className="following-user"
                                onClick={() => navigate(`/profile/${f.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={followingImages[f.id] || perfil}
                                    alt={`${f.name} ${f.secondName}`}
                                    className="profile-image"
                                />
                                <b><span className="profile-name">{f.name} {f.secondName}</span></b>
                            </div>
                        ))}
                    </div>

                    {/* Coluna de posts */}
                    <div className="col-12 col-md-10 overflow-auto reports-overflow">
                        <CreateReportButton onReportCreated={addNewPostToList} />
                        {posts.length === 0 ? (
                            <p>Nenhuma postagem encontrada.</p>
                        ) : (
                            posts.map(post => (
                                <ReportCard key={post.id} post={post} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}