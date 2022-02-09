import React, { useContext, useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useAppDispatch } from '../../hooks';
import { SendbirdContext } from '../Context/SendBirdProvider';
import { setUser } from './authSlice';

const Auth = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const sendbird = useContext(SendbirdContext);
    const [userId, setUserId] = useState('');
    const handleUserIdChange = (userId: string) => {
        setUserId(userId);
    };

    const handleConnect = () => {
        if (userId && sendbird) {
            sendbird.connect(userId, (user, err) => {
                if (err) {
                    Toast.show({
                        type: 'error',
                        text1: 'Hello',
                        position: 'bottom',
                    });
                    return;
                }

                // Navigate to Chat screen to chat with care manager
                // Save userId to redux store
                dispatch(
                    setUser({
                        userId: user.userId,
                        isActive: user.isActive,
                        nickname: user.nickname,
                    }),
                );
                navigation.navigate('Chat');
            });
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <TextInput
                placeholder={'User ID'}
                onChangeText={content => handleUserIdChange(content)}
                style={style.loginInput}
            />
            <TouchableOpacity
                activeOpacity={0.85}
                style={[style.loginButton, { backgroundColor: '#742ddd' }]}
                onPress={handleConnect}>
                <Text>Connect</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const style = {
    container: {
        flex: 1,
    },
    loginInput: {
        height: 48,
        fontSize: 16,
        padding: 12,
        borderColor: '#777',
        borderWidth: 0.2,
        borderRadius: 5,
        marginBottom: 8,
        alignSelf: 'stretch',
    },
    loginButton: {
        height: 48,
        padding: 12,
        backgroundColor: '#742ddd',
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 8,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Auth;

