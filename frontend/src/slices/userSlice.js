import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/userService';

const initialState = {
    user: {},
    users: [],
    error: null,
    success: false,
    loading: false,
    message: null
}

// GET USER DETAILS
export const profile = createAsyncThunk(
    "user/profile", async (user, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await userService.profile(user, token);

        return data;
    }
);

// UPDATE USER DETAILS
export const updateProfile = createAsyncThunk("user/update", async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token

    const data = await userService.updateProfile(user, token)

    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
}
);

// GET USER DETAILS BY ID
export const getUserDetails = createAsyncThunk("user/get", async (id, thunkAPI) => {
    const data = await userService.getUserDetails(id);

    return data;
}
);

// GET ALL USERS
export const getAllUsers = createAsyncThunk("user/getAll", async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.getAllUsers(token);
    return data;
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
            .addCase(profile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
                state.message = "Usuário atualizado com sucesso!"
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = {};
            })
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Erro ao buscar usuários";
            });;
    },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;