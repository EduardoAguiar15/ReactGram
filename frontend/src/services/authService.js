import { api, requestConfig } from '../utils/config'

const register = async (data) => {
    const config = requestConfig("POST", data);

    try {
        const response = await fetch(`${api}/users/register`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao registrar usuário"] };
        }

        if (res._id) {
            localStorage.setItem("user", JSON.stringify(res));
        }

        return res;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return { errors: ["Erro ao registrar usuário."] };
    }
};

const logout = () => {
    localStorage.removeItem("user")
}

const login = async (data) => {
    const config = requestConfig("POST", data);
    try {
        const response = await fetch(`${api}/users/login`, config);
        const res = await response.json();

        if (!response.ok) {
            return { errors: res.details || [res.message || "Erro ao fazer login"] };
        }

        if (res._id) {
            localStorage.setItem("user", JSON.stringify(res));
        }

        return res;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return { errors: ["Erro ao fazer login."] };
    }
};

const authService = {
    register,
    logout,
    login
};

export default authService;