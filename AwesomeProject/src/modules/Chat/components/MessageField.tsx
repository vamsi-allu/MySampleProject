import React, { useContext, useRef } from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import SendBird, { AdminMessage, FileMessage, UserMessage } from 'sendbird';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
    CUSTOM_MESSAGE_TYPE_FILE_FROM_LIB,
    CUSTOM_MESSAGE_TYPE_VOICE_NOTE,
} from '../../Constants/Sendbird';
import { SendbirdContext } from '../../Context/SendBirdProvider';
import { ChatMessage, initMessages, newMessage } from '../chatSlice';
import ChatBubble from './ChatBubble';
import ImageBubble from './ImageBubble';
import VoiceNoteBubble from './VoiceNoteBubble';

const MessageField = ({ channel }: { channel: SendBird.GroupChannel }) => {
    const dispatch = useAppDispatch();
    const chatMessages = useAppSelector(state => state.chat.messages);
    const sendbird = useContext(SendbirdContext);
    const handlerId = useRef<string | null>(null);
    const userId = useAppSelector(state => state.auth.userId);
    const flatlistRef = useRef<FlatList<any>>();

    useEffect(() => {
        // Load all previous messages from this channel
        if (!channel || !sendbird) {
            return;
        }

        const listQuery = channel.createPreviousMessageListQuery();
        listQuery.limit = 20;
        listQuery.reverse = false;
        listQuery.includeMetaArray = true;
        listQuery.includeReactions = true;
        listQuery.load((messages, error) => {
            console.log(messages);
            console.log('-------------------------');
            const chatMessages = messages.map(message => {
                return {
                    sender: {
                        userId: message.sender.userId,
                        isActive: message.sender.isActive,
                        nickname: message.sender.nickname,
                    },
                    message: message.message,
                    messageType: message.messageType,
                    messageId: message.messageId,
                    parentMessageId: message.parentMessageId,
                    customType: message.customType,
                    url: message.url,
                    createdAt: message.createdAt,
                };
            });
            dispatch(initMessages(chatMessages));

            // Set a message receivied handler
            const channelHandler = new sendbird.ChannelHandler();
            channelHandler.onMessageReceived = handleMessageReceived;
            channelHandler.onReadReceiptUpdated = handleMessageRead;
            handlerId.current = Math.random().toString(16).substr(2, 8);
            sendbird.addChannelHandler(handlerId.current, channelHandler);
        });
    }, []);

    useEffect(() => {
        return () => {
            if (handlerId.current) {
                sendbird?.removeChannelHandler(handlerId.current);
            }
        };
    }, []);

    const handleMessageReceived = (
        channel: SendBird.GroupChannel,
        message:
            | SendBird.UserMessage
            | SendBird.FileMessage
            | SendBird.AdminMessage,
    ) => {
        console.log(message);
        if (message && message.messageType == 'user') {
            dispatch(
                newMessage({
                    sender: {
                        userId: message.sender.userId,
                        isActive: message.sender.isActive,
                        nickname: message.sender.nickname,
                    },
                    message: message.message,
                    messageType: message.messageType,
                    messageId: message.messageId,
                    parentMessageId: message.parentMessageId,
                    createdAt: message.createdAt,
                }),
            );
        } else if (
            message &&
            message.messageType == 'file' &&
            message.customType == CUSTOM_MESSAGE_TYPE_VOICE_NOTE
        ) {
            dispatch(
                newMessage({
                    sender: {
                        userId: message.sender.userId,
                        isActive: message.sender.isActive,
                        nickname: message.sender.nickname,
                    },
                    messageType: message.messageType,
                    messageId: message.messageId,
                    parentMessageId: message.parentMessageId,
                    createdAt: message.createdAt,
                    url: message.url,
                    customType: message.customType,
                }),
            );
        } else if (
            message &&
            message.messageType == 'file' &&
            message.customType == CUSTOM_MESSAGE_TYPE_FILE_FROM_LIB
        ) {
            dispatch(
                newMessage({
                    sender: {
                        userId: message.sender.userId,
                        isActive: message.sender.isActive,
                        nickname: message.sender.nickname,
                    },
                    messageType: message.messageType,
                    messageId: message.messageId,
                    parentMessageId: message.parentMessageId,
                    createdAt: message.createdAt,
                    url: message.url,
                    customType: message.customType,
                }),
            );
        }

        // Mark message as delivered

        sendbird?.markAsReadWithChannelUrls([channel.url]);
    };

    const handleMessageRead = channel => {
        console.log('Read', channel);
    };

    const handleRenderChatBubble = (item: ChatMessage, index: number) => {
        console.log(index);
        if (item.messageType === 'user') {
            if (item.sender.userId === userId) {
                return (
                    <ChatBubble
                        isReceived={false}
                        message={item.message || ''}
                        messageId={index}
                    />
                );
            } else {
                return (
                    <ChatBubble
                        isReceived={true}
                        message={item.message || ''}
                        messageId={index}
                    />
                );
            }
        } else if (item.customType === CUSTOM_MESSAGE_TYPE_VOICE_NOTE) {
            if (item.sender.userId === userId) {
                return (
                    <VoiceNoteBubble
                        isReceived={false}
                        url={item.url}
                        messageId={index}
                        createdAt={item.createdAt}
                    />
                );
            } else {
                return (
                    <VoiceNoteBubble
                        isReceived={true}
                        url={item.url}
                        messageId={index}
                        createdAt={item.createdAt}
                    />
                );
            }
        } else if (item.customType === CUSTOM_MESSAGE_TYPE_FILE_FROM_LIB) {
            if (item.sender.userId === userId) {
                return (
                    <ImageBubble
                        isReceived={false}
                        url={item.url}
                        messageId={index}
                        createdAt={item.createdAt}
                    />
                );
            } else {
                return (
                    <ImageBubble
                        isReceived={true}
                        url={item.url}
                        messageId={index}
                        createdAt={item.createdAt}
                    />
                );
            }
        }

        return null;
    };

    return (
        <View style={{ marginBottom: 20 }}>
            <FlatList
                onContentSizeChange={() =>
                    flatlistRef.current?.scrollToEnd({ animated: true })
                }
                ref={flatlistRef}
                style={{ backgroundColor: '#eee' }}
                data={chatMessages ?? []}
                keyExtractor={(item) => item.key?.toString()}
                renderItem={({ item, index }) => handleRenderChatBubble(item, index)}
            />
        </View>
    );
};

export default MessageField;
