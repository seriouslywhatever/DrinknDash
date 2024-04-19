import React from 'react';
import renderer from 'react-test-renderer';
import Horse from '../Horse'; 

describe('Horse', () => {
    it('renders correctly', () => {
        const distance = { value: 100 };
        const size = 50; 

        const tree = renderer
            .create(<Horse distance={distance} size={size} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});
