import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentService from "../services/commentService";

const initialState = {
    comments: [],
    loading: false,
    error: null,
    message: null,
    success: false,
};

// ADD COMMENT TO PHOTO
export const commentPhoto = createAsyncThunk("/comment", async (commentData, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    const body = {
        comment: commentData.comment,
        ...(commentData.replyTo && { replyTo: commentData.replyTo })
    };

    const data = await commentService.comment(commentData.id, body, token);
    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data;
});

// LIKE COMMENT
export const likeComment = createAsyncThunk(
    "comments/likeComment",
    async (commentId, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;

        const data = await commentService.likeComment(commentId, token);

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        return data;
    }
);

// GET ALL COMMENTS
export const getAllComments = createAsyncThunk(
    "comments/getAllComments",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token;
        const data = await commentService.getAllComments(token);

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        return data;;
    }
);

// GET COMMENTS BY PHOTO ID
export const getCommentsByPhotoId = createAsyncThunk("comments/getCommentsByPhotoId", async (id, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    const data = await commentService.getCommentsByPhotoId(id, token);

    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data;
})

export const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        resetCommentsMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(commentPhoto.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(commentPhoto.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.comments.push(action.payload.comment);
                state.message = action.payload.message || "Comentário adicionado!";
            })
            .addCase(commentPhoto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                const { commentId, userId } = action.payload;
                const updateLike = (comments) => comments.map(comment => {
                    if (comment._id === commentId) {
                        const likes = comment.like || [];
                        const alreadyLiked = likes.includes(userId);

                        return {
                            ...comment,
                            like: alreadyLiked
                                ? likes.filter(id => id !== userId)
                                : [...likes, userId],
                        };
                    }

                    if (comment.replies) comment.replies = updateLike(comment.replies);
                    return comment;
                });

                state.comments = updateLike(state.comments);
                state.success = true;
                state.message = action.payload.message || "Like atualizado!";
            })
            .addCase(getAllComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.comments;
            })
            .addCase(getAllComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCommentsByPhotoId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCommentsByPhotoId.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
                state.success = true;
            })
            .addCase(getCommentsByPhotoId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCommentsMessage } = commentSlice.actions;
export default commentSlice.reducer;