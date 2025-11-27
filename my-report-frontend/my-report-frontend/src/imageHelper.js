import { useEffect, useState } from "react";

export default function useImageLoader(endpointUrl, token) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!endpointUrl) return;

        let isMounted = true;

        async function loadImage() {
            try {
                const response = await fetch(endpointUrl, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        return null;
                    } else {
                        throw new Error("Erro ao carregar imagem");
                    }
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (isMounted) setImageUrl(url);
            } catch (e) {
                console.error("Falha ao carregar imagem:", e);
            }
        }

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [endpointUrl, token]);

    return imageUrl;
}
