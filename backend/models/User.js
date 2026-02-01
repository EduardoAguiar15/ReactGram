const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            default: "default.png",
        },
        bio: {
            type: String,
            default: "",
        },
    },
    { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;