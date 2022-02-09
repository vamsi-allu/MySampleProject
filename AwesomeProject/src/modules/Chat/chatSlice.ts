import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SendBird from 'sendbird';
import { UserDetails } from '../Auth/authSlice';
import Chat from './Chat';

export interface ChatState {
    messages: Array<ChatMessage>;
}

export interface ChatMessage {
    messageId: number;
    parentMessageId: number;
    messageType: string;
    message?: string;
    sender: UserDetails;
    customType?: string;
    url?: string;
    createdAt: number;
}

const initialState: ChatState = {
    messages: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        initMessages: (state, action: PayloadAction<Array<ChatMessage>>) => {
            state.messages = action.payload;
        },
        newMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
    },
});

export const { initMessages, newMessage } = chatSlice.actions;
export default chatSlice.reducer;
