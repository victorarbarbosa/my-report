import './Header.css';
import logoNav from './assets/myreport-logo-white.svg';
import perfil from './assets/perfil3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Header() {  
    return (
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src={logoNav} alt="Logo" width="30" height="24" class="logo-nav"/>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <form class="d-flex search" role="search">
                        <input class="form-control me-2 search-input" type="search" placeholder="Pesquise" aria-label="Search"/>
                        <button class="btn btn-light" type="submit"><FontAwesomeIcon icon={faSearch}/></button>
                    </form>
                </div>

                <div className='ai-button'>
                    <button className='btn btn-info'><FontAwesomeIcon icon={faGoogle} size='lg' className='ai-icon'/>Gemini</button>
                </div>

                <div className="d-flex justify-content-start gap-4">
                    <a className='profile-icon'>
                        <img src={perfil} className='profile-image'/>
                        <span className='perfil-span'>Perfil</span>
                    </a>
                    <button className="btn btn-danger">Sair</button>
                </div>
            </div>
        </nav>
    )
}