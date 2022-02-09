import React, { useContext, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import SendBird from 'sendbird';
import SoundRecorder from 'react-native-sound-recorder';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SendbirdContext } from '../../Context/SendBirdProvider';
import { newMessage } from '../chatSlice';
import {
    CUSTOM_MESSAGE_TYPE_FILE_FROM_LIB,
    CUSTOM_MESSAGE_TYPE_VOICE_NOTE,
} from '../../Constants/Sendbird';
import { ATTACH_TO_CHAT } from '../../Constants/Camera';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';

const InputBar = ({
    navigation,
    channel,
}: {
    navigation: any;
    channel: SendBird.GroupChannel;
}) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.auth.userId);
    const isActive = useAppSelector(state => state.auth.isActive);
    const nickname = useAppSelector(state => state.auth.nickname);
    const sendbird = useContext(SendbirdContext);
    const [message, setMessage] = useState('');
    const { showActionSheetWithOptions } = useActionSheet();

    const handleSendUserMessage = () => {
        if (!sendbird) {
            return;
        }
        const params = new sendbird.UserMessageParams();
        params.message = message;
        params.customType = CUSTOM_MESSAGE_TYPE_VOICE_NOTE;

        channel.sendUserMessage(params, msg => {
            console.log(msg);
            setMessage('');
            if ('message' in msg && 'sender' in msg) {
                dispatch(
                    newMessage({
                        sender: {
                            userId: msg.sender.userId,
                            isActive: msg.sender.isActive,
                            nickname: msg.sender.nickname,
                        },
                        message: msg.message,
                        messageType: msg.messageType,
                        messageId: msg.messageId,
                        parentMessageId: msg.parentMessageId,
                        createdAt: msg.createdAt,
                    }),
                );
            }
        });
    };

    const handleStartVoiceNote = () => {
        console.log(
            `Voice note recording started at ${SoundRecorder.PATH_DOCUMENT}`,
        );
        SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + '/voiceNote.mp4');
    };

    const handleEndVoiceNote = async () => {
        console.log('Voice note recording ended');
        const result = await SoundRecorder.stop();
        console.log(result.path);

        // Send this file
        handleSendVoiceNote(result.path);
    };

    const handleSendVoiceNote = async (file: string) => {
        if (!sendbird) {
            return;
        }

        // Read file from path
        const fileStat = await RNFS.stat(file);
        const params = new sendbird.FileMessageParams();
        params.file = {
            uri: `file://${fileStat.path}`,
            size: fileStat.size,
            name: `${Math.random().toString(16).substr(2, 8)}.mp4`,
            type: 'video/mp4',
        };
        params.customType = CUSTOM_MESSAGE_TYPE_VOICE_NOTE;

        console.log(params);

        channel.sendFileMessage(params, (msg, error) => {
            console.log(error, msg);
            dispatch(
                newMessage({
                    sender: {
                        userId: userId,
                        isActive: isActive,
                        nickname: nickname,
                    },
                    messageType: msg.messageType,
                    messageId: msg.messageId,
                    parentMessageId: msg.parentMessageId,
                    customType: msg.customType,
                    url: msg.url,
                    createdAt: msg.createdAt,
                }),
            );
        });
    };

    const handlePickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size,
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    };

    const handleInitCamera = () => {
        navigation.navigate('CameraViewFinder', {
            trigger: ATTACH_TO_CHAT,
            navigation: navigation,
        });
    };

    const handleOpenLibrary = () => {
        const options = {
            mediaType: 'mixed' as MediaType,
            selectionLimit: 1,
        };

        launchImageLibrary(options, result => {
            console.log(result);
            if (result.didCancel) {
                return;
            }
            if (result.assets && result.assets.length) {
                // File was selected by the user, send it
                // Since we allow only one file to be seleted, it will always be at index 0.
                handleSendFileFromLibrary(result.assets[0]);
            }
        });
    };

    const handleSendFileFromLibrary = (asset: any) => {
        if (!sendbird) {
            return;
        }

        const params = new sendbird.FileMessageParams();
        params.file = {
            uri: asset.uri,
            size: asset.fileSize,
            name: asset.fileName,
            type: asset.type,
        };
        params.mimeType = asset.type;
        params.fileSize = asset.fileSize;
        params.fileName = asset.fileName;
        params.thumbnailSizes = [{ maxWidth: 100, maxHeight: 100 }];
        params.customType = CUSTOM_MESSAGE_TYPE_FILE_FROM_LIB;

        channel.sendFileMessage(params, (msg, error) => {
            console.log(error, msg);
            dispatch(
                newMessage({
                    sender: {
                        userId: userId,
                        isActive: isActive,
                        nickname: nickname,
                    },
                    messageType: msg.messageType,
                    messageId: msg.messageId,
                    parentMessageId: msg.parentMessageId,
                    customType: msg.customType,
                    url: msg.url,
                    createdAt: msg.createdAt,
                }),
            );
        });
    };

    const handleShowActionSheet = () => {
        showActionSheetWithOptions(
            {
                options: ['Camera', 'Document', 'Photo & Video Library', 'Cancel'],
                cancelButtonIndex: 3,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0: {
                        handleInitCamera();
                        break;
                    }
                    case 1: {
                        handlePickDocument();
                        break;
                    }
                    case 2: {
                        handleOpenLibrary();
                    }
                }
            },
        );
    };

    const handleMessageChange = content => setMessage(content);

    return (
        <>
            <SafeAreaView />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.plusButton}
                    onPress={handleShowActionSheet}>
                    <Text>{'Plus'}</Text>
                </TouchableOpacity>
                <View style={styles.textInputView}>
                    <TextInput
                        multiline
                        placeholder={'Message...'}
                        onChangeText={content => handleMessageChange(content)}
                        value={message}
                    />
                </View>
                <TouchableOpacity
                    style={styles.sendButton}
                    onPressIn={handleStartVoiceNote}
                    onPressOut={handleEndVoiceNote}>
                    <Text>{'Mic'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendUserMessage}>
                    <Text>{'Send'}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    textInputView: {
        flex: 3,
        padding: 5,
        borderColor: '#333',
        borderRadius: 20,
        borderWidth: 5,
    },
    sendButton: {
        flex: 1,
        borderRadius: 50,
        marginLeft: 24,
        borderWidth: 5,
        alignItems: 'center',
    },
    plusButton: {
        marginRight: 24,
    },
});

export default InputBar;
