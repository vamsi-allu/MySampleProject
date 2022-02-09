import React, { createContext } from 'react';
import SendBird, { SendBirdInstance } from 'sendbird';
import { APP_ID } from '../Constants/Sendbird';

export const SendbirdContext = createContext<null | SendBirdInstance>(null);

export const SendbirdProvider = ({ children }: { children: any }) => {
    const sendbird = new SendBird({ appId: APP_ID });
    sendbird.setErrorFirstCallback(false);

    return (
        <SendbirdContext.Provider value={sendbird}>
            {children}
        </SendbirdContext.Provider>
    );
};