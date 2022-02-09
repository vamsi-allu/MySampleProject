import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import SendBird from 'sendbird';
import { useAppSelector } from '../../hooks';
import { SendbirdContext } from '../Context/SendBirdProvider';
import InputBar from './components/InputBar';
import MessageField from './components/MessageField';

const Chat = ({ navigation }) => {
    const sendbird = useContext(SendbirdContext);
    const userId = useAppSelector(state => state.auth.userId);
    const [channel, setChannel] = useState<null | SendBird.GroupChannel>(null);

    useEffect(() => {
        // Get care manager's userid

        // Open a Sendbird channel between the care manager and the user
        if (userId) {
            const CM_USER_ID = userId == 'Test123' ? 'CM123' : 'Test123';
            sendbird?.GroupChannel.createChannelWithUserIds(
                [userId, CM_USER_ID],
                true,
                (groupChannel, err) => {
                    if (err) {
                        Toast.show({
                            type: 'error',
                            text1: 'Hello',
                            position: 'bottom',
                        });
                        return;
                    }

                    console.log(groupChannel);
                    setChannel(groupChannel);
                },
            );
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flex: 6 }}>
                {channel && <MessageField channel={channel} />}
            </View>
            {channel && <InputBar navigation={navigation} channel={channel} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default Chat;
