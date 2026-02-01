import { api, requestConfig } from '../utils/config'

// GET USER PROFILE
const profile = async (data, token) => {
    const config = requestConfig("GET", data, token);

    try {
        const response = await fetch(`${api}/users/profile`, config);
        
        if(!response.ok) {
            throw new Error("Erro ao buscar perfil de usuário");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar perfil de usuário:", error);
        return { errors: ["Erro ao buscar perfil de usuário"] };
    }
};

//UPDATE USER PROFILE
const updateProfile = async (data, token) => {
    try {
        const response = await fetch(`${api}/users/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: data
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar perfil de usuário");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { errors: ["Erro ao atualizar perfil"] };
    }
};

// GET USER BY ID
const getUserDetails = async (id) => {
    const config = requestConfig("GET")

    try {
        const response = await fetch(`${api}/users/${id}`, config)
        
        if(!response.ok) {
            throw new Error("Erro ao buscar usuário por id: " + id);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar usuário por id: " + id, error);
        return { errors: ["Erro ao buscar usuário por id"] };
    }
};

// GET ALL USERS
const getAllUsers = async (token) => {
    const config = requestConfig("GET", null, token);

    try {
        const response = await fetch(`${api}/users/all`, config);
        
        if(!response.ok) {
            throw new Error("Erro ao buscar todos os usuários");
        }
        
        const data = await response.json();
        return data;
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