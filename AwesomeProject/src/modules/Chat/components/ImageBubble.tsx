import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox-v2';

interface IImageBubble {
    isReceived?: boolean;
    url: string;
    messageId: number;
    createdAt: number;
}

const ImageBubble = React.memo(({
    isReceived,
    url,
    messageId,
    createdAt,
}: IImageBubble) => {
    if (!isReceived) {
        return (
            <View style={styles.sentBubble} key={messageId}>
                <FastImage
                    style={{ width: 200, height: 200 }}
                    source={{
                        uri: url,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.receivedBubble} key={messageId}>
                <FastImage
                    style={{ width: 200, height: 200 }}
                    source={{
                        uri: url,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    }
});

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

export default ImageBubble;
