const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/token");
const {
    AppError,
    UserNotFoundError,
    UnprocessableEntityError,
} = require("../errors/typeError");

const register = async ({ name, email, password }) => {
    const userExists = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
    
    if (userExists) {
        throw new UnprocessableEntityError("Por favor, utilize outro e-mail");
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
    });

    const token = generateToken(newUser._id);

    return {
        _id: newUser._id,
        profileImage: newUser.profileImage || "",
        token
    };
}

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new UserNotFoundError();
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        throw new UnprocessableEntityError();
    }

    const token = generateToken(user._id);

    return {
        _id: user._id,
        profileImage: user.profileImage || "",
        token
    };
}

async function update(userId, body, file) {
    const { name, password, bio } = body;

    const user = await User.findById(userId);

    if (!user) {
        throw new UserNotFoundError();
    }

    if (name && name.trim()) user.name = name.trim();
    if (bio) user.bio = bio;

    if (file) {
        user.profileImage = file.filename;
    }

    if (password && password.trim().length > 5) {
        const passwordHash = await hashPassword(password);
        user.password = passwordHash;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
}


async function getUserById(id) {
    try {
        const user = await User
            .findById(id)
            .select("-password");

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    } catch (error) {
        if (error.name === "CastError") {
            throw new UserNotFoundError();
        }
        throw error;
    }
}

async function getAllUsers() {
    try {
        const users = await User.find().select("-password");
        return users;
    } catch (error) {
        throw new AppError("Erro ao buscar usuários", 500);
    }
}

module.exports = {
    register,
    login,
    update,
    getUserById,
    getAllUsers
};