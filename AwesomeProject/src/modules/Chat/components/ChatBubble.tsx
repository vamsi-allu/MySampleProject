import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IChatBubble {
    isReceived?: boolean;
    message: string;
    messageId: number;
}

const ChatBubble = ({ isReceived, message, messageId }: IChatBubble) => {
    if (!isReceived) {
        return (
            <View style={styles.sentBubble} key={messageId}>
                <Text style={{ fontSize: 16, color: '#fff' }}>{message}</Text>
                <View style={styles.rightArrow}></View>
                <View style={styles.rightArrowOverlap}></View>
            </View>
        );
    } else {
        return (
            <View style={styles.receivedBubble} key={messageId}>
                <Text style={{ fontSize: 16, color: '#000' }}>{message}</Text>
                <View style={styles.leftArrow}></View>
                <View style={styles.leftArrowOverlap}></View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    receivedBubble: {
        backgroundColor: '#dedede',
        padding: 10,
        marginTop: 5,
        marginLeft: '5%',
        maxWidth: '50%',
        alignSelf: 'flex-start',
        //maxWidth: 500,
        //padding: 14,
        marginBottom: 20,

        //alignItems:"center",
        borderRadius: 20,
    },
    sentBubble: {
        backgroundColor: '#0078fe',
        padding: 10,
        marginLeft: '45%',
        //marginBottom: 15,
        marginTop: 5,
        marginRight: '5%',
        maxWidth: '50%',
        alignSelf: 'flex-end',
        //maxWidth: 500,
        borderRadius: 20,
        marginBottom: 20,
    },
    rightArrow: {
        position: 'absolute',
        backgroundColor: '#0078fe',
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10,
    },
    rightArrowOverlap: {
        position: 'absolute',
        backgroundColor: '#eeeeee',
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20,
    },
    leftArrow: {
        position: 'absolute',
        backgroundColor: '#dedede',
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10,
    },
    leftArrowOverlap: {
        position: 'absolute',
        backgroundColor: '#eeeeee',
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20,
    },
});

export default ChatBubble;
