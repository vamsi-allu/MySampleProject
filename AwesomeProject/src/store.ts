
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import authReducer from './modules/Auth/authSlice';
import chatReducer from './modules/Chat/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;