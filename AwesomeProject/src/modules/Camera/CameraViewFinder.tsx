import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraViewFinder = ({
    trigger,
    navigation,
}: {
    trigger: string;
    navigation: any;
}) => {
    const handleCloseCamera = () => {
        navigation.pop();
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <TouchableOpacity onPress={handleCloseCamera}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20 }}>Flash</Text>
                </TouchableOpacity>
            </View>
            <RNCamera style={styles.preview}></RNCamera>
            <View style={styles.bottomBar}>
                <TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20 }}>SNAP</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 20 }}>Cam</Text>
        </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    toolbar: {
        flexDirection: 'row',
        marginTop: 50,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomBar: {
        flexDirection: 'row',
        marginBottom: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
    },
});

export default CameraViewFinder;

