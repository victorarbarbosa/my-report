import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import "./AIChat.css"

export default function AIChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const token = localStorage.getItem("token");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage() {
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setMessages(prev => [...prev, userMsg]);

        const res = await fetch("http://localhost:8080/api/gemini/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ message: input })
        });

        if (!res.ok) {
            console.error("Erro ao chamar backend:", res.status);
            return;
        }

        const data = await res.text();
        setMessages(prev => [...prev, { from: "ai", text: data }]);
        setInput("");
    }

    return (
        <main>
            <Header />

            <div className="ai-chat-container">
                <div className="messages">
                    {messages.map((m, i) => (
                        <div key={i} className={m.from === "user" ? "msg user" : "msg ai"}>
                            {m.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Digite sua mensagem..."
                    />
                    <button onClick={sendMessage}>Enviar</button>
                </div>
            </div>
        </main>
    );
}