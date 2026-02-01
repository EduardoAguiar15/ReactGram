import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "../services/messageService";

const initialState = {
    messages: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    success: false,
};

// SEND MESSAGE
export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async ({ token, receiverId, text }, thunkAPI) => {
        try {
            const data = await messageService.sendMessage(token, receiverId, text);
            if (data.errors) {
                return thunkAPI.rejectWithValue(data.errors[0]);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Erro ao enviar mensagem.");
        }
    }
);

// GET MESSAGES BY CONVERSATION ID
export const getMessagesByConversation = createAsyncThunk(
    "messages/getMessagesByConversation",
    async ({ token, conversationId, page = 1, limit = 20 }, thunkAPI) => {
        try {
            const data = await messageService.getMessagesByConversation(
                token,
                conversationId,
                page,
                limit
            );
            if (data.errors) {
                return thunkAPI.rejectWithValue(data.errors[0]);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Erro ao buscar mensagens.");
        }
    }
);

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        resetMessageState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearMessages: (state) => {
            state.messages = [];
            state.page = 1;
            state.totalPages = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const newMsg = action.payload;
                if (newMsg && newMsg._id) {
                    state.messages.push(newMsg);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMessagesByConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessagesByConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const { messages, page, totalPages } = action.payload;

                if (page === 1) {
                    state.messages = messages;
                } else {
                    state.messages = [...messages, ...state.messages];
                }
                state.page = page;
                state.totalPages = totalPages;
            })
            .addCase(getMessagesByConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetMessageState, clearMessages, addLocalMessage } = messageSlice.actions;
export default messageSlice.reducer;