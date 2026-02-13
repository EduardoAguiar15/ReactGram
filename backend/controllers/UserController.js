const UserService = require("../services/UserService");

// REGISTER USER AND SIGN IN
const register = async (req, res) => {
    try {
        const user = await UserService.register(req.body);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao criar usuário",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// LOGIN USER
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginResult = await UserService.login({ email, password });

        return res.status(200).json(loginResult);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao fazer login",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// GET CURRENT LOGGED IN USER
const getCurrentUser = async (req, res) => {
    try {
        const user = await UserService.getCurrentUser(req.user._id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar usuário logado",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// UPDATE AN USER
const update = async (req, res) => {
    try {
        const updatedUser = await UserService.update(
            req.user._id,
            req.body,
            req.file
        );

        return res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao atualizar usuário",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar usuário",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar usuários",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
    getAllUsers
};