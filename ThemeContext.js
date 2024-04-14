import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Provider to change the theme of the application. 
 * Based on value theme which gets changed in the Settings screen.
 */
export const ThemeProvider = ({ children }) => {

    //Values for light mode of the application
    const lightTheme = {
        backgroundImage: require('./assets/wood.jpg'),
        trackImage: require('./assets/track.jpg'),
        fenceImage: require('./assets/fence.jpg'),
        color: '#343434', //dark
        backgroundColor: '#EDEADE', //light
    }


    //Values for Dark mode of the application
    const darkTheme = {
        backgroundImage: require('./assets/wood_dark.jpg'),
        trackImage: require('./assets/track_dark.jpg'),
        fenceImage: require('./assets/fence_dark.jpg'),
        color: '#EDEADE', //light
        backgroundColor: '#343434', //dark
    }

    const [theme, setTheme] = useState(lightTheme);

    //Method to change the theme of the application.
    const changeTheme = (value) => {
        console.log(value);
        setTheme(value ? lightTheme : darkTheme);
    };

    useEffect(() => {
        const checkForPreference = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                changeTheme(JSON.parse(savedTheme));
            }
        }
        checkForPreference();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
