import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getConversationBetween, getUserConversations } from "../services/conversationService";

const initialState = {
  currentConversation: null,
  userConversations: [],
  loading: false,
  error: null,
  success: false,
};

// GET USER CONVERSATIONS
export const userConversations = createAsyncThunk(
  "conversations/userConversations",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getUserConversations(token);
      if (data?.errors) {
        return rejectWithValue(data.errors);
      }
      return data;
    } catch (error) {
      return rejectWithValue(["Erro ao buscar conversas do usuário."]);
    }
  }
);

// GET CONVERSATION BETWEEN TWO USERS
export const conversationBetween = createAsyncThunk(
  "conversations/conversationBetween",
  async ({ token, userId }, { rejectWithValue }) => {
    try {
      const data = await getConversationBetween(token, userId);
      if (data?.errors) {
        return rejectWithValue(data.errors);
      }
      return data;
    } catch (error) {
      return rejectWithValue(["Erro ao buscar conversa entre usuários."]);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    resetConversationState: (state) => {
      state.currentConversation = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(conversationBetween.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(conversationBetween.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        state.success = true;
      })
      .addCase(conversationBetween.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentConversation = null;
      })
      .addCase(userConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.userConversations = action.payload;
        state.success = true;
      })
      .addCase(userConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetConversationState } = conversationSlice.actions;
export default conversationSlice.reducer;