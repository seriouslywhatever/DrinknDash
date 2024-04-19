import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';
import { useWebSocket } from '../WebsocketContext';
import { useTheme } from '../ThemeContext';
import Bcrypt from 'react-native-bcrypt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default Register = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const { socket } = useWebSocket();
    const { theme } = useTheme();
    const { t } = useTranslation();

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
                            navigation.navigate('Home');
                        } catch (error) {
                            console.error('Error storing credentials:', error);
                        }
                    };
                    storeCredentials();
                } else if (server_message[0] == "INCORRECT") {
                    ToastAndroid.show('Email or Username is aleady in use!', ToastAndroid.LONG);
                }
            };
        }
    }, [socket, username]);

    //Check if email follows set requirements.
    const isValidEmail = () => {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return emailRegex.test(email);
    };

    //Enables/disables the register button.
    const canRegister = () => {
        return (
            isValidEmail() &&
            username.length > 0 &&
            password.length > 0 &&
            password1 === password
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                    <View style={styles.maxScroll}>
                        <Text style={[styles.registerText, { color: theme.color }]}>{t('registerText')}</Text>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: theme.color }}>{t('iEmail')}</Text>
                                {!emailError ? <Text style={{ color: 'red' }}>{t('registerWarningEmail')}</Text> : null}
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                                placeholder={t('ipEmail')}
                                onEndEditing={() => setEmailError(isValidEmail())}
                                autoFocus={true}
                                keyboardType="email-address"
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: theme.color }}>{t('iUsername')}</Text>
                                {usernameError ? <Text style={{ color: 'red' }}>{t('registerWarningUsername')}</Text> : null}
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setUsername}
                                value={username}
                                placeholder={t('ipUsername')}
                                onEndEditing={() => setUsernameError(username.length <= 0)}
                            />
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
                            <PasswordStrengthMeterBar password={password} />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: theme.color }}>{t('rePasswordLabel')}</Text>
                                {passwordError ? <Text style={{ color: 'red' }}>{t('passwordMatchError')}</Text> : null}
                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword1}
                                value={password1}
                                placeholder={t('ipRePassword')}
                                secureTextEntry={true}
                                onEndEditing={() => setPasswordError(password1 != password)}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <KeyboardAvoidingView behavior="padding">
                    <TouchableOpacity
                        disabled={!canRegister()}
                        onPress={() => {
                            Bcrypt.hash(password, 10, (err, hash) => {
                                if (!err) {
                                    const user = {
                                        username: username,
                                        email: email,
                                        password: hash
                                    }

                                    if (socket && socket.readyState === WebSocket.OPEN) {
                                        socket.send("REGISTER " + JSON.stringify(user));
                                    }

                                } else {
                                    console.error('Error hashing the password:', err);
                                }
                            });
                        }}
                        style={[styles.buttonLogin, { backgroundColor: !canRegister() ? "gray" : theme.backgroundColor }]}>
                        <Text style={[styles.buttonText, { color: theme.color }]}>{t('registerText')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    main: {
        height: '100%'
    },
    registerText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: '5%'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#EDEADE',
        marginBottom: '5%'
    },
    buttonLogin: {
        position: "absolute",
        bottom: 50,
        borderRadius: 12,
        padding: 10,
        alignSelf: 'center',
        width: '75%'
    },
    buttonText: {
        fontSize: 28,
        textAlign: 'center'
    },
    maxScroll: {
        height: 200,
        margin: '5%'
    },
});