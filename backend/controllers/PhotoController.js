const PhotoService = require("../services/PhotoService");

// GET ALL PHOTOS
const getAllPhotos = async (req, res) => {
    try {
        const photos = await PhotoService.getAllPhotos();
        return res.status(200).json(photos);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar fotos",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// SEARCH PHOTOS BY TITLE
const searchPhotos = async (req, res) => {
    const { q } = req.query;
    try {
        const photos = await PhotoService.searchPhotos(q);
        return res.status(200).json(photos);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar fotos",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// GET USER PHOTOS
const getUserPhotos = async (req, res) => {
    try {
        const photos = await PhotoService.getUserPhotos(req.params.id);
        return res.status(200).json(photos);

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar fotos do usuário",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// GET PHOTO BY ID
const getPhotoById = async (req, res) => {
    try {
        const photo = await PhotoService.getPhotoById(req.params.photoId);
        return res.status(200).json(photo);

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao buscar foto",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// INSERT A PHOTO, WITH AN USER RELATED TO IT
const insertPhoto = async (req, res) => {
    try {
        const photo = await PhotoService.insertPhoto({
            title: req.body.title,
            image: req.file.filename,
            userId: req.user._id,
        });

        return res.status(201).json(photo);
    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao postar foto",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// REMOVE A PHOTO FROM DB
const deletePhoto = async (req, res) => {
    try {
        const result = await PhotoService.deletePhoto(req.params.id, req.user._id);

        return res.status(200).json({
            id: result.id,
            message: "Foto excluída com sucesso!"
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao deletar foto",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};


// UPDATE A PHOTO
const updatePhoto = async (req, res) => {
    try {
        const result = await PhotoService.updatePhoto(
            req.params.id,
            req.user._id,
            req.body.title
        );

        return res.status(200).json({
            photo: result.photo,
            message: "Foto atualizada com sucesso!"
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao atualizar foto",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

// LIKE FUNCTIONALITY
const likePhoto = async (req, res) => {
    try {
        const result = await PhotoService.likePhoto(
            req.params.id,
            req.user._id
        );
        if (result.liked) {
            return res.status(200).json({
                liked: true,
                photoId: result.photoId,
                userId: result.userId,
                message: "A foto foi curtida."
            });
        } else {
            return res.status(200).json({
                liked: false,
                photoId: result.photoId,
                userId: result.userId,
                message: "Like removido."
            });
        }

    } catch (error) {
        return res.status(error.status || 500).json({
            status: "error",
            message: error.userMessage || "Erro ao curtir foto",
            details: error.details || [error.message || "Erro inesperado"],
        });
    }
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    searchPhotos
};