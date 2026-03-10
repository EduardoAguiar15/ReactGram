import { api, requestConfig } from '../utils/config'

const profile = async (data, token) => {
    const config = requestConfig("GET", data, token);

    try {
        const response = await fetch(`${api}/users/profile`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar perfil de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar perfil de usuário:", error);
        return { errors: ["Erro ao buscar perfil de usuário"] };
    }
};

const updateProfile = async (data, token) => {
    try {
        const response = await fetch(`${api}/users/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: data
        });
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao atualizar perfil de usuário"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { errors: ["Erro ao atualizar perfil"] };
    }
};

const getUserDetails = async (id) => {
    const config = requestConfig("GET")

    try {
        const response = await fetch(`${api}/users/${id}`, config)
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar usuário por id: " + id] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar usuário por id: " + id, error);
        return { errors: ["Erro ao buscar usuário por id"] };
    }
};

const getAllUsers = async (token) => {
    const config = requestConfig("GET", null, token);

    try {
        const response = await fetch(`${api}/users/all`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao buscar todos os usuários"] };
        }

        return res;
    } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
        return { errors: ["Erro ao buscar todos os usuários"] };
    }
};

const userService = {
    profile,
    updateProfile,
    getUserDetails,
    getAllUsers
}

export default userService;