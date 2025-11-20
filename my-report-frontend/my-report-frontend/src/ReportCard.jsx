import React from "react";
import "./ReportCard.css"
import perfil from './assets/perfil3.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faCircleArrowDown, faComment } from '@fortawesome/free-solid-svg-icons';

export default function ReportCard() {
    return (
        <div className="report">
            <a className='profile-icon'>
                <img src={perfil} className='profile-image'/>
                <b><span className='profile-name'>Victor Barbosa</span></b>
            </a>
            <span className="me-3">Para:</span>
            <a className='profile-icon'>
                <img src={perfil} className='profile-image'/>
                <b><span className='profile-name'>Bradesco</span></b>
            </a>

            <h4 className="report-title">Title</h4>

            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
                standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make 
                a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, 
                remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing 
                Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

            <img src={perfil} className="report-image"></img>

            <div className="report-options">
                <div className="upvote">
                    <FontAwesomeIcon icon={faCircleArrowUp} />
                    <span className="upvote-number">0</span>
                    <FontAwesomeIcon icon={faCircleArrowDown} />
                </div>
                <div className="comment">
                    <FontAwesomeIcon icon={faComment} className="comment-icon me-1" />
                    <span className="comments-number">0</span>
                </div>
            </div>
        </div>
    )
}