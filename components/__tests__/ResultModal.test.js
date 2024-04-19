import React from 'react';
import { Text, ImageBackground } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import ResultModal from '../ResultModal';
import { ThemeProvider, useTheme } from '../../ThemeContext';

jest.mock('../../ThemeContext', () => ({
    useTheme: () => ({ theme: { color: 'black', backgroundImage: require('../../assets/wood.jpg') } })
}));

describe('ResultModal', () => {
    it('renders correctly', () => {
        const results = [
            { id: '1', place: 1, suit: 0 },
            { id: '2', place: 2, suit: 1 },
            { id: '3', place: 3, suit: 2 },
            { id: '4', place: 4, suit: 3 }
        ];
        const tree = renderer.create(<ResultModal results={results} show={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('displays the correct number of results', () => {
        const results = [
            { id: '1', place: 1, suit: 0 },
            { id: '2', place: 2, suit: 1 },
            { id: '3', place: 3, suit: 2 },
            { id: '4', place: 4, suit: 3 }
        ];
        const { getAllByText } = render(<ResultModal results={results} show={true} />);
        const resultItems = getAllByText(/1st Place|2nd Place|3rd Place|4th Place/);
        expect(resultItems.length).toBe(results.length);
    });
});



