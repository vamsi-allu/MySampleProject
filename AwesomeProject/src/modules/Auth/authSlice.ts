import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    userId: null | string;
    isActive: boolean;
    nickname: null | string;
}

export interface UserDetails {
    userId: null | string;
    isActive: boolean;
    nickname: null | string;
}

const initialState: AuthState = {
    userId: null,
    isActive: false,
    nickname: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDetails>) => {
            state.userId = action.payload.userId;
            state.isActive = action.payload.isActive;
            state.nickname = action.payload.nickname;
        },
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
