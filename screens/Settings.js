import { useState, useEffect } from "react";
import { Image, Switch, Text, View, TouchableOpacity, Alert, ImageBackground, StyleSheet } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useWebSocket } from '../WebsocketContext';
import { useTheme } from '../ThemeContext';
import { useI18n } from "../I18nContext";
import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Settings = ({ navigation }) => {

    const { theme, changeTheme } = useTheme(); //Provider of style values based on application theme.

    /**
     * Values to change preferences
     */

    const [isDarkMode, setDarkMode] = useState();
    const toggleSwitch = async () => {
        setDarkMode(!isDarkMode);
        changeTheme(isDarkMode); //Changes the application theme.
        await AsyncStorage.setItem('theme', JSON.stringify(isDarkMode));
    };

    const [isPushEnabled, setPush] = useState(false);
    const togglePushSwitch = () => setPush(!isPushEnabled);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const [items, setItems] = useState([
        { label: I18n.t('englishLabel'), value: 'en' },
        { label: I18n.t('dutchLabel'), value: 'nl' }
    ]);

    const { socket } = useWebSocket();
    const { changeLanguage } = useI18n(); //changes language of application.

    useEffect(() => {

        //retrieve stored variables to set initial value of preferences
        const checkForPreference = async () => {
            const language = await AsyncStorage.getItem('locale');
            const savedTheme = await AsyncStorage.getItem('theme');

            if (language) {
                setValue(language);
            } else {
                setValue('en');
            }
            if (savedTheme) {
                setDarkMode(!JSON.parse(savedTheme));
            } else {
                setDarkMode(true);
            }
        }

        checkForPreference();

        if (socket) {
            socket.onmessage = async (event) => {
                // Handle incoming messages from the server
                var server_message = event.data.split(' ');
                if (server_message[0] == "DELETE") {
                    await AsyncStorage.removeItem('username');
                    navigation.navigate("Login");
                } else if (server_message[0] == "CANCEL") {
                    navigation.replace("Home");
                }
            }
        }

        //Navigate back to Home screen and trigger its UseEffect to render changes.
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (socket) {
                socket.send("WITHDRAW");
            }
        });

        return unsubscribe;

    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.settingsText, { color: theme.color }]}>{I18n.t('settingsText')}</Text>
                    <View style={styles.preferenceList}>
                        <View style={styles.preferenceContainer}>
                            <View style={styles.preferenceTextContainer}>
                                <Text style={{ fontSize: 20, color: theme.color }}>{I18n.t('darkModeText')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#767577' }}
                                    thumbColor={isDarkMode ? '#767577' : '#f4f3f4'}
                                    onValueChange={toggleSwitch}
                                    value={isDarkMode}
                                />
                            </View>
                        </View>
                        <View style={styles.preferenceContainer}>
                            <View style={styles.preferenceTextContainer}>
                                <Text style={{ fontSize: 20, color: theme.color }}>{I18n.t('pushNotificationText')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#767577' }}
                                    thumbColor={isPushEnabled ? '#767577' : '#f4f3f4'}
                                    onValueChange={togglePushSwitch}
                                    value={isPushEnabled}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("PasswordChange")} style={[styles.preferenceContainer, { padding: '5%' }]}>
                            <View style={[styles.preferenceTextContainer, { flex: 3 }]}>
                                <Text style={{ fontSize: 20, color: theme.color }}>{I18n.t('changePasswordText')}</Text>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Image source={require('../assets/arrow.jpg')} style={styles.arrowImage} resizeMode="contain" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.preferenceContainer}>
                            <View style={[styles.preferenceTextContainer, { flex: 3 }]}>
                                <Text style={{ fontSize: 20, color: theme.color }}>{I18n.t('languagesText')}</Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    style={[styles.dropdown, { color: theme.color }]}
                                    onSelectItem={async (item) => {
                                        await AsyncStorage.setItem('locale', item.value);
                                        changeLanguage(item.value);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(I18n.t('deleteAccountText'), I18n.t('deleteAccountWarning'), [
                                {
                                    text: I18n.t('dialogButtonCancel'),
                                    style: 'cancel',
                                },
                                { text: I18n.t('dialogButtonConfirm'), onPress: () => socket.send("DELETE") },
                            ]);
                        }} style={styles.button}>
                            <Text style={styles.buttonText}>{I18n.t('deleteAccountText')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginHorizontal: '5%'
    },
    preferenceList: {
        flex: 1,
        marginVertical: '15%'
    },
    preferenceContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: '3%'
    },
    preferenceTextContainer: {
        flex: 3,
        justifyContent: 'center'
    },
    settingsText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: '5%',
    },
    arrowContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    arrowImage: {
        width: 30,
        height: 30
    },
    dropdown: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    buttonContainer: {
        flex: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12
    },
    button: {
        position: "absolute",
        bottom: 50,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'red',
        fontSize: 24,
    },
});