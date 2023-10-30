import * as React from 'react';
import { AppRegistry } from 'react-native';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { name as appName } from './app.json';
import App from './src/App';
import store from './src/store/Store'
import { Provider } from 'react-redux'

const fontConfig = {
    web: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'sans-serif-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'sans-serif-thin',
            fontWeight: 'normal',
        },
    },
    ios: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'sans-serif-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'sans-serif-thin',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'inter',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'inter',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'inter',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'inter',
            fontWeight: 'normal',
        },
    }
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
};

export default function Main() {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <App />
            </PaperProvider>
        </Provider>


    );
}

AppRegistry.registerComponent(appName, () => Main);