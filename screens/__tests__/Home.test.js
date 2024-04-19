import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '../../ThemeContext';
import { WebSocketProvider } from '../../WebsocketContext';
import { I18nProvider } from '../../I18nContext';
import  Home from '../Home'

jest.mock('../../ThemeContext', () => ({
    useTheme: () => ({ theme: { color: 'black', backgroundImage: require('../../assets/wood.jpg') } })
}));

jest.mock('../../WebsocketContext', () => ({
    useWebSocket: () => ({ socket: { send: jest.fn() } })
}));

jest.mock('../../i18nContext', () => ({
    useI18n: jest.fn().mockReturnValue({
        locale: 'en',
        changeLanguage: jest.fn(),
    }),
}));

describe('Home', () => {

    test('renders correctly', () => {
        const tree = renderer.create(<Home />);
        expect(tree).toMatchSnapshot();
    });

});