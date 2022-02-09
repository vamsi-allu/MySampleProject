import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import {
    ActionSheetProvider,
    connectActionSheet,
} from '@expo/react-native-action-sheet';
import Toast from 'react-native-toast-message';

import { SendbirdProvider } from '../Context/SendBirdProvider';
import Auth from '../Auth/Auth';
import Chat from '../Chat/Chat';
import CameraViewFinder from '../Camera/CameraViewFinder';
import { store } from '../../store';

const Stack = createStackNavigator();

const Init = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <SendbirdProvider>
                    <ActionSheetProvider>
                        <Stack.Navigator>
                            <Stack.Screen
                                name="Auth"
                                component={Auth}
                                options={{ title: 'Login' }}
                            />
                            <Stack.Screen
                                name="Chat"
                                component={Chat}
                                options={{ title: 'Chat' }}
                            />
                            <Stack.Screen
                                name="CameraViewFinder"
                                component={CameraViewFinder}
                                options={{
                                    title: 'Camera',
                                    headerShown: false,
                                }}
                            />
                        </Stack.Navigator>
                    </ActionSheetProvider>
                </SendbirdProvider>
                <Toast ref={ref => Toast.setRef(ref)} />
            </NavigationContainer>
        </Provider>
    );
};

const ConnectedApp = connectActionSheet(Init);
export default ConnectedApp;
