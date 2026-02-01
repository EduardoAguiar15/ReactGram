const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");
const {
    InvalidIdError,
    UserNotFoundError,
    PhotoNotFoundError,
    CreatePhotoError,
    ForbiddenError
} = require("../errors/typeError");

async function getAllPhotos() {
    const photos = await Photo.find({})
        .populate("userId", "name profileImage")
        .sort([["createdAt", -1]])
        .exec();
    return photos;
}

async function searchPhotos(query) {
    const photos = await Photo.find({ title: new RegExp(query, "i") })
        .populate("userId", "name profileImage")
        .exec();
    return photos;
}

async function getPhotoById(photoId) {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
        throw new InvalidIdError();
    }

    const photo = await Photo.findById(photoId)
        .populate("userId", "name profileImage");

    if (!photo) {
        throw new PhotoNotFoundError();
    }

    return photo;
}

async function getUserPhotos(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new InvalidIdError();
    }

    const photos = await Photo.find({ userId })
        .populate("userId", "name profileImage")
        .sort([["createdAt", -1]])
        .exec();

    return photos;
}

async function insertPhoto({ title, image, userId }) {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new InvalidIdError();
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new UserNotFoundError();
    }

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
    });

    if (!newPhoto) {
        throw new CreatePhotoError();
    }

    return newPhoto;
}

async function updatePhoto(photoId, userId, newTitle) {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
        throw new InvalidIdError();
    }
    const photo = await Photo.findById(photoId);

    if (!photo) {
        throw new PhotoNotFoundError();
    }
    if (!photo.userId.equals(userId)) {
        throw new ForbiddenError();
    }
    if (newTitle) {
        photo.title = newTitle;
    }

    await photo.save();
    return { photo };
}

async function likePhoto(photoId, userId) {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
        throw new InvalidIdError();
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
        throw new PhotoNotFoundError();
    }

    const alreadyLiked = photo.likes.includes(userId);

    if (alreadyLiked) {
        photo.likes.pull(userId);
        await photo.save();

        return {
            liked: false,
            photoId,
            userId
        };
    } else {
        photo.likes.push(userId);
        await photo.save();

        return {
            liked: true,
            photoId,
            userId
        };
    }
}

async function deletePhoto(photoId, userId) {
    if (!mongoose.Types.ObjectId.isValid(photoId)) {
        throw new InvalidIdError();
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
        throw new PhotoNotFoundError();
    }

    if (!photo.userId.equals(userId)) {
        throw new ForbiddenError();
    }

    await Photo.findByIdAndDelete(photoId);

    return { id: photoId };
}

module.exports = {
    getAllPhotos,
    searchPhotos,
    insertPhoto,
    likePhoto,
    getPhotoById,
    getUserPhotos,
    deletePhoto,
    updatePhoto
};