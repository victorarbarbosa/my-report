import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReportCard from "./ReportCard";
import Header from "./Header";
import perfil from './assets/empty-profile-image.jpg';
import "./SearchResults.css"

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchResults() {
            if (!query || !token) return;

            try {
                // Buscar posts
                const postsRes = await fetch(`http://localhost:8080/api/report/search?searchTerm=${encodeURIComponent(query)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const postsData = postsRes.ok ? await postsRes.json() : [];

                // Buscar usuários
                const usersRes = await fetch(`http://localhost:8080/api/user/search?query=${encodeURIComponent(query)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let usersData = usersRes.ok ? await usersRes.json() : [];

                // Para cada usuário, buscar a imagem de perfil
                usersData = await Promise.all(
                    usersData.map(async (user) => {
                        try {
                            const imgRes = await fetch(`http://localhost:8080/api/user/${user.id}/profile-image`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (imgRes.ok) {
                                const blob = await imgRes.blob();
                                user.profileImageUrl = URL.createObjectURL(blob);
                            } else {
                                user.profileImageUrl = perfil;
                            }
                        } catch {
                            user.profileImageUrl = perfil;
                        }
                        return user;
                    })
                );

                setPosts(postsData);
                setUsers(usersData);

            } catch (err) {
                console.error("Erro ao buscar resultados:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [query, token]);

    if (loading) return <p>Carregando resultados...</p>;

    return (
        <main>
            <Header />

            <div className="container my-4">
                <h3>Resultados para: "{query}"</h3>

                <section className="mb-4">
                    <h5>Usuários</h5>
                    {users.length === 0 ? <p>Nenhum usuário encontrado.</p> : (
                        <div className="d-flex gap-3 flex-wrap">
                            {users.map(user => (
                                <div 
                                    key={user.id} 
                                    className="user-card"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    <img src={user.profileImageUrl} className="profile-image me-2"/>
                                    <p className="mt-3">{user.name} {user.secondName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h5>Postagens</h5>
                    {posts.length === 0 ? <p>Nenhuma postagem encontrada.</p> : (
                        posts.map(post => <ReportCard key={post.id} post={post} />)
                    )}
                </section>
            </div>
        </main>
    );
}