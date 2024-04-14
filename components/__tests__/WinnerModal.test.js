import React from 'react';
import { Text, ImageBackground } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import WinnerModal from '../WinnerModal';

jest.mock('../../ThemeContext', () => ({
    useTheme: () => ({ theme: { color: 'black', backgroundImage: require('../../assets/wood.jpg') } })
}));

jest.mock('../../WebsocketContext', () => ({
    useWebSocket: () => ({ socket: { send: jest.fn() } })
}));

describe('WinnerModal', () => {
    it('renders correctly', () => {
        const losers = [
            { userId: '1', username: 'User1' },
            { userId: '2', username: 'User2' },
            { userId: '3', username: 'User3' }
        ];
        const tree = renderer.create(<WinnerModal losers={losers} show={true} bet={2} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('displays the correct number of losers', () => {
        const losers = [
          { userId: '1', username: 'User1' },
          { userId: '2', username: 'User2' },
          { userId: '3', username: 'User3' }
        ];
        const { getAllByText } = render(<WinnerModal losers={losers} show={true} bet={2} />);
        const loserItems = getAllByText(/User1|User2|User3/);
        expect(loserItems.length).toBe(losers.length);
      });
});  