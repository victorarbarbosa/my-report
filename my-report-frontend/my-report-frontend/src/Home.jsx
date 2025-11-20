import React from "react";
import Header from "./Header";
import ReportCard from "./ReportCard";
import "./Home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import perfil from './assets/perfil3.jpg';

export default function Home() {
    return (
        <main>
            <Header></Header>

            <div className="container-fluid">
                <div className="row">
                    <div class="overflow-auto following-overflow col-2">
                        <div className="mb-2"><b><span>Seguindo</span></b></div>
                        <div className="following-user">
                            <a className='profile-icon'>
                                <img src={perfil} className='profile-image'/>
                                <b><span className='profile-name'>Victor Barbosa</span></b>
                            </a>
                        </div>
                    </div>
                    <div class="overflow-auto reports-overflow col-10">
                        <div className="create-report">
                            <FontAwesomeIcon icon={faSquarePlus} size="2x" className="me-3"/>
                            <h3 className="mt-1">Faça uma nova denuncia</h3>
                        </div>
                        <ReportCard></ReportCard>
                    </div>
                </div>
            </div>
        </main>
    )
}