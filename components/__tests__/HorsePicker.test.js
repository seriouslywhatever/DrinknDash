import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HorsePicker from '../HorsePicker';
import { WebSocketProvider } from '../../WebsocketContext';

jest.mock('../../ThemeContext', () => ({
    useTheme: () => ({ theme: { color: 'black', backgroundImage: require('../../assets/wood.jpg') } })
}));

jest.mock('../../WebsocketContext', () => ({
    useWebSocket: () => ({ socket: { send: jest.fn() } })
}));

describe('HorsePicker', () => {

    it('opens modal on suit press', () => {
        const { getByTestId } = render(<HorsePicker />);
        fireEvent.press(getByTestId('diamonds-suit'));
        expect(getByTestId('sipsSelectionID')).toBeTruthy();
    });

    it('sends bet on confirmation', () => {
        const mockOnWagerValues = jest.fn();
        const { getByTestId } = render(<HorsePicker onWagerValues={mockOnWagerValues} />);
        fireEvent.press(getByTestId('diamonds-suit')); 
        fireEvent.press(getByTestId('confirm-button'));
        expect(mockOnWagerValues).toHaveBeenCalledWith(1, 0);
    });
});