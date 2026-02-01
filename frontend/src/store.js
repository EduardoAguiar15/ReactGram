import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice";
import userReducer from './slices/userSlice';
import photoReducer from './slices/photoSlice';
import commentReducer from './slices/commentSlice';
import conversationReducer from './slices/conversationSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer,
        comments: commentReducer,
        conversation: conversationReducer,
        messages: messageReducer,
    },
})