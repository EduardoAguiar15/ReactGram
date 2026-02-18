import { api, requestConfig } from '../utils/config';

// PUBLISH PHOTO
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

// GET USER PHOTOS
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

// DELETE PHOTO
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

// UPDATE PHOTO
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

// GET PHOTO BY ID
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

// LIKE PHOTO
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

// GET ALL PHOTOS
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


// SEARCH PHOTO BY TITLE
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