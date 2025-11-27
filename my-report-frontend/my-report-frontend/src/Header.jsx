import './Header.css';
import logoNav from './assets/myreport-logo-white.svg';
import perfilDefault from './assets/empty-profile-image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Header() {  
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(perfilDefault);
    const [searchQuery, setSearchQuery] = useState("");

    const token = localStorage.getItem("token");
    let loggedUserId = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            loggedUserId = decoded.userId;
        } catch (e) {
            console.error("Erro ao decodificar token:", e);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === "") return;
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
    }

    useEffect(() => {
        if (!loggedUserId || !token) return;

        async function loadProfileImage() {
            try {
                const response = await fetch(`http://localhost:8080/api/user/${loggedUserId}/profile-image`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setProfileImage(imageUrl);
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                        return; 
                    }
                    console.warn("Imagem de perfil não encontrada, usando padrão.");
                }
            } catch (error) {
                console.error("Erro ao carregar imagem:", error);
            }
        }

        loadProfileImage();
    }, [loggedUserId, token]);

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="/home">
                    <img src={logoNav} alt="Logo" width="30" height="24" className="logo-nav"/>
                </a>

                {/* Botão hamburguer */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Conteúdo colapsável */}
                <div 
                    className="collapse navbar-collapse custom-collapse-right" 
                    id="navbarContent"
                >
                    {/* Barra de pesquisa */}
                    <form className="d-flex search" role="search" onSubmit={handleSearch}>
                        <input
                            className="form-control me-2 search-input"
                            type="search"
                            placeholder="Pesquise"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-light" type="submit">
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                    </form>

                    {/* Botões e perfil */}
                    <div className="d-flex flex-column gap-2">
                        <button 
                            className='btn btn-info'
                            onClick={() => navigate("/ai-chat")}
                        >
                            <FontAwesomeIcon icon={faGoogle} size='lg' className='ai-icon'/> Gemini
                        </button>

                        <a 
                            className='profile-button d-flex align-items-center' 
                            onClick={() => navigate('/profile')} 
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={profileImage} className='profile-image'/>
                            <span className='perfil-span mb-2'>Perfil</span>
                        </a>

                        <button 
                            className="btn btn-danger"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/");
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}