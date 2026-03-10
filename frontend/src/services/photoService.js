import { api, requestConfig } from '../utils/config';

const publishPhoto = async (data, token) => {

    const config = requestConfig("POST", data, token, true);

    try {
        const response = await fetch(`${api}/photos/insert`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao publicar foto de usuário"] };
        }

        return res;
    }
    catch (error) {
        console.error("Erro ao publicar foto:", error);
        return { errors: ["Erro ao publicar foto"] };
    }
};

const getUserPhotos = async (id, token) => {
    const config = requestConfig("GET", null, token);

    try {
        const response = await fetch(`${api}/photos/user/${id}`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar fotos do usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar fotos do usuário:", error);
        return { errors: ["Erro ao buscar fotos do usuário"] };
    }
};

const deletePhoto = async (id, token) => {

    const config = requestConfig("DELETE", null, token);

    try {
        const response = await fetch(`${api}/photos/${id}`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao deletar foto de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao deletar foto:", error);
        return { errors: ["Erro ao deletar foto"] };
    }
};

const updatePhoto = async (data, id, token) => {
    const config = requestConfig("PUT", data, token)

    try {

        const response = await fetch(`${api}/photos/${id}`, config)
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao atualizar foto de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        return { errors: ["Erro ao atualizar foto"] };
    }
}

const getPhoto = async (id, token) => {
    const config = requestConfig("GET", null, token);

    try {

        const response = await fetch(`${api}/photos/${id}`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar foto de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar foto por id:", error);
        return { errors: ["Erro ao buscar foto por id"] };
    }
}

const like = async (id, token) => {

    const config = requestConfig("PUT", null, token)

    try {
        const response = await fetch(`${api}/photos/${id}/like/`, config)
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao curtir foto de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao curtir foto:", error);
        return { errors: ["Erro ao curtir foto"] };
    };
}

const getPhotos = async (token) => {
    const config = requestConfig("GET", null, token);

    try {
        const response = await fetch(`${api}/photos/`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar fotos"] };
        }

        return res;

    } catch (error) {
        console.error("Erro no getPhotos:", error);
        return { errors: [error.message] };
    }
};

const searchPhotos = async (Query, token) => {

    const config = requestConfig("GET", null, token);

    try {
        const response = await fetch(`${api}/photos/search?q=${Query}`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar fotos"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        return { errors: ["Erro ao buscar fotos"] };
    }
}
const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto,
    getPhoto,
    like,
    getPhotos,
    searchPhotos,
};

export default photoService;