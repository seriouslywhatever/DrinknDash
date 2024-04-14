import React, { createContext, useState, useContext, useEffect } from 'react';
import I18n from 'react-native-i18n';
import en from './translations/en.json';
import nl from './translations/nl.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

I18n.fallbacks = true;
I18n.translations = { en, nl };

const I18nContext = createContext();

/**
 * Provider for changing the language of the application.
 * Based on value theme which gets changed in the Settings screen.
 * default language is english.
 */
export const I18nProvider = ({ children }) => {

    useEffect(() => {
        const checkForPreference = async () => {
            const language = await AsyncStorage.getItem('locale');
            if (language) {
                I18n.locale = language;
            } else {
                I18n.locale = 'en';
            }
        }
        checkForPreference();
    }, []);

    const [locale, setLocale] = useState(I18n.locale);

    //Changes the language of the application. 
    const changeLanguage = (newLocale) => {
        if (newLocale) {
            I18n.locale = newLocale;
            setLocale(newLocale);
        } else {
            I18n.locale = locale;
        }
    };

    return (
        <I18nContext.Provider value={{ locale, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    return useContext(I18nContext);
};