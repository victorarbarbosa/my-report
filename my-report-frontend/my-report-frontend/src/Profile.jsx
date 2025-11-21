import React from "react";
import Header from "./Header";
import ReportCard from "./ReportCard";
import "./Profile.css";
import perfil from './assets/perfil3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    return (
        <main className="profile-main">
            <Header />

            <div className="container profile-container">
                <div className="row">
                    <div className="col-12 col-md-4 mb-4">
                        <div className="user-info-card shadow-sm">
                            <img src={perfil} alt="Foto de Perfil" className="big-profile-image" />
                            <h2 className="user-name">Victor Barbosa</h2>
                            <p className="user-email text-muted">victor.barbosa@email.com</p>
                            
                            <p className="user-bio">
                                Apaixonado por justiça digital e transparência. 
                                Contribuindo para uma internet mais segura no MyReport.
                            </p>

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-number">12</span>
                                    <span className="stat-label">Denúncias</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">45</span>
                                    <span className="stat-label">Apoiadores</span>
                                </div>
                            </div>

                            <button className="btn btn-primary w-100">
                                <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
                                Editar Perfil
                            </button>
                        </div>
                    </div>

                    <div className="col-12 col-md-8 user-reports-section">
                        <h3 className="section-title">Minhas Denúncias</h3>
                        
                        <ReportCard />
                        <ReportCard />
                    </div>
                </div>
            </div>
        </main>
    );
}