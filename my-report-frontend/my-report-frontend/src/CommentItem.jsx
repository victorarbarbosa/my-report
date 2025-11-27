import { useState } from "react";
import useImageLoader from "./imageHelper";
import perfil from "./assets/empty-profile-image.jpg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // <--- IMPORTANTE
import "./CommentItem.css"

export default function CommentItem({ comment, token, onUpdate }) {

    const navigate = useNavigate(); // <--- AQUI

    const image = useImageLoader(
        `http://localhost:8080/api/user/${comment.userId}/profile-image`,
        token
    );

    let loggedUserId = null;
    if (token) {
        const decoded = jwtDecode(token);
        loggedUserId = decoded.userId;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.message);

    async function saveEdit() {
        if (!editedText.trim()) return;

        await fetch(`http://localhost:8080/api/message/${comment.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            },
            body: new URLSearchParams({
                senderId: loggedUserId,
                newMessage: editedText
            })
        });

        setIsEditing(false);

        onUpdate({
            ...comment,
            message: editedText
        });
    }

    return (
        <div className="comment-card">

            <div className="comment-header">

                <div 
                    onClick={() => navigate(`/profile/${comment.userId}`)} // <--- AÇÃO
                    style={{ cursor: "pointer" }}
                    className="mb-2 mt-2">
                    <img
                        src={image || perfil}
                        className="comment-profile-image me-2"
                    />

                    <b>{comment.senderFullName}</b>
                </div>

                {comment.userId === loggedUserId && (
                    <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        ✏️ Editar
                    </button>
                )}
            </div>

            {isEditing ? (
                <>
                    <textarea
                        className="form-control mt-2"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                    />

                    <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={saveEdit}
                    >
                        Salvar
                    </button>

                    <button
                        className="btn btn-secondary btn-sm mt-2 ms-2"
                        onClick={() => {
                            setEditedText(comment.message);
                            setIsEditing(false);
                        }}
                    >
                        Cancelar
                    </button>
                </>
            ) : (
                <p className="comment-text">{comment.message}</p>
            )}
        </div>
    );
}