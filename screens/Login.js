import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { useWebSocket } from '../WebsocketContext';
import { useI18n } from '../I18nContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';


export default Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { socket } = useWebSocket();
    const { changeLanguage } = useI18n();
    const { theme, changeTheme } = useTheme(); //Provider of style values based on application theme.
    const { t } = useTranslation();

    //Retrieve the language preference to on launch
    useFocusEffect(
        useCallback(() => {
            const checkForPreference = async () => {
                const language = await AsyncStorage.getItem('locale');
                const savedTheme = await AsyncStorage.getItem('theme');
                if (language) {
                    changeLanguage(language);
                }
                if (theme) {
                    changeTheme(JSON.parse(savedTheme));
                }
            }
            checkForPreference();
        }, [])
    );

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                // Handle incoming messages from the server
                var server_message = event.data.split(' ');
                if (server_message[0] == "LOGIN") {
                    const storeCredentials = async () => {
                        try {
                            const userHolder = JSON.parse(server_message[1]);
                            await AsyncStorage.setItem('username', userHolder.username);
                            navigation.replace('Home');
                        } catch (error) {
                            console.error('Error storing credentials:', error.message);
                        }
                    };
                    storeCredentials();
                } else if (server_message[0] == "INCORRECT") {
                    ToastAndroid.show('Incorrect Username or Password!', ToastAndroid.SHORT);
                }
            };
        }

        //Automatically log user in if previously logged in.
        const checkForAccount = async () => {
            try {
                const name = await AsyncStorage.getItem('username');
                if (name && socket) {
                    if (name.length > 0) {
                        const user = {
                            username: name
                        }
                        socket.send("LOGIN " + JSON.stringify(user));
                    }
                }
            } catch (error) {
                console.error('Error storing credentials:', error.message);
            }
        }
        checkForAccount();
    }, [socket, username]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'} >
            <View style={styles.main}>
                <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                    <View style={styles.container}>
                        <Text style={[styles.loginText, { color: theme.color }]}>{t('loginText')}</Text>
                        <View style={{ marginVertical: '15%' }}>
                            <Text style={{ color: theme.color }}>{t('iUsername')}</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setUsername}
                                value={username}
                                placeholder={t('ipUsername')} />
                        </View>
                        <View>
                            <Text style={{ color: theme.color }}>{t('iPassword')}</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword}
                                value={password}
                                placeholder={t('ipPassword')}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("PasswordRecover")}>
                                <Text style={[styles.passwordRecoverText, { color: theme.color }]}>{t('forgotPasswordText')}</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginEnd: '1%', color: theme.color }}>{t('noAccountText')}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={{ fontWeight: 'bold', color: theme.color }}>{t('signUpText')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.buttonLogin, { backgroundColor: theme.backgroundColor }]}>
                        <TouchableOpacity onPress={() => {
                            const user = {
                                username: username,
                                password: password
                            }

                            if (socket && socket.readyState === WebSocket.OPEN) {
                                setUsername(user.username);
                                socket.send("LOGIN " + JSON.stringify(user));
                            }

                        }}><Text style={[styles.buttonText, { color: theme.color }]}>{t('loginText')}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground >
            </View >
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        height: 100,
        margin: '5%'
    },
    textContainer: {
        alignItems: 'center',
        marginTop: '5%'
    },
    loginText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: '5%'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#EDEADE'
    },
    passwordRecoverText: {
        fontWeight: '500',
        marginBottom: '2%',
    },
    buttonLogin: {
        position: "absolute",
        bottom: '15%',
        borderRadius: 12,
        padding: 10,
        alignSelf: 'center',
        width: '75%'
    },
    buttonText: {
        fontSize: 28,
        textAlign: 'center',
    }
});