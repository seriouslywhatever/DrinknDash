import 'intl-pluralrules';
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import nl from './translations/nl.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: { translation: en },
            nl: { translation: nl }
        },
        lng: 'en', // default language
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

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
                i18n.changeLanguage(language);
            }
        }
        checkForPreference();
    }, []);

    const [locale, setLocale] = useState(i18n.language);

    //Changes the language of the application. 
    const changeLanguage = (newLocale) => {
        if (newLocale) {
            i18n.changeLanguage(newLocale);
            setLocale(newLocale);
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