import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
    photo: { likes: [] },
    photos: [],
    error: false,
    success: false,
    loading: false,
    message: null
}

// PUBLISH USER PHOTO
export const publishPhoto = createAsyncThunk(
    "photo/publish", async (photo, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.publishPhoto(photo, token)

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
)

// GET USER PHOTOS
export const getUserPhotos = createAsyncThunk(
    "photo/userphotos", async (id, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.getUserPhotos(id, token);

        return data;
    }
);

// DELETE PHOTO
export const deletePhoto = createAsyncThunk(
    "photo/delete", async (id, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.deletePhoto(id, token);

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
);

// UPDATE PHOTO
export const updatePhoto = createAsyncThunk(
    "photo/update", async (photoData, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.updatePhoto({ title: photoData.title }, photoData.id, token);

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data;
    }
);

// GET PHOTO BY ID
export const getPhoto = createAsyncThunk("photo/getphoto", async (id, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getPhoto(id, token);

    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data;
})

// LIKE PHOTO
export const like = createAsyncThunk("photos/like", async (id, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.like(id, token);

    return data;
})

// GET ALL PHOTOS
export const getPhotos = createAsyncThunk("photo/getall", async (_, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getPhotos(token);

    return data;
})

// SEARCH PHOTOS
export const searchPhotos = createAsyncThunk(
    "photo/search", async (query, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await photoService.searchPhotos(query, token);

        return data;
    }
);

export const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(publishPhoto.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(publishPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.photo = action.payload;
                state.photos.unshift(state.photo)
                state.message = "Foto publicada com sucesso!"
            })
            .addCase(publishPhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photo = {};
            })
            .addCase(getUserPhotos.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getUserPhotos.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.photos = action.payload;
            })
            .addCase(deletePhoto.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deletePhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                state.photos = state.photos.filter((photo) => {
                    return photo._id !== action.payload.id
                });

                state.message = action.payload.message;
            })
            .addCase(deletePhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photo = {};
            })
            .addCase(updatePhoto.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updatePhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                state.photos.map((photo) => {
                    if (photo._id === action.payload.photo._id) {

                        return photo.title = action.payload.photo.title
                    }
                    return photo;
                });

                state.message = action.payload.message;
            })
            .addCase(updatePhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photo = {};
            })
            .addCase(getPhoto.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.photo = action.payload;
            })
            .addCase(getPhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photo = [];
            })
            .addCase(getPhotos.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getPhotos.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.photos = Array.isArray(action.payload) ? action.payload : [action.payload];
            })
            .addCase(getPhotos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photo = [];
            })
            .addCase(searchPhotos.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(searchPhotos.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.photos = action.payload;
            })
            .addCase(searchPhotos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.photos = [];
            })
            .addCase(like.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                const { photoId, userId } = action.payload;

                if (state.photo._id === photoId) {
                    const alreadyLiked = state.photo.likes.includes(userId);

                    state.photo.likes = alreadyLiked
                        ? state.photo.likes.filter((id) => id !== userId)
                        : [...state.photo.likes, userId];
                }

                                                                                                                                
                state.photos = state.photos.map((photo) => {
                    if (photo._id === photoId) {
                        const alreadyLiked = photo.likes.includes(userId);

                        return {
                            ...photo,
                            likes: alreadyLiked
                                ? photo.likes.filter((id) => id !== userId)
                                : [...photo.likes, userId]
                        };
                    }
                    return photo;
                });

                state.message = action.payload.message;
            })
            .addCase(like.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;