import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, ToastAndroid, ScrollView, Alert } from 'react-native';
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';
import { useWebSocket } from '../WebsocketContext';
import { useTheme } from '../ThemeContext';
import { useTranslation } from 'react-i18next';

export default PasswordChange = ({ navigation }) => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.
    const { t } = useTranslation();
    useEffect(() => {
        //Display toasts to inform user
        if (socket) {
            // Handle incoming messages from the server.
            socket.onmessage = (event) => {
                if (event.data == "CORRECT") {
                    ToastAndroid.show(t('passwordCorrect'), ToastAndroid.LONG);
                } else if (event.data == "INCORRECT") {
                    ToastAndroid.show(t('passwordIncorrect'), ToastAndroid.LONG);
                }
            }
        }
    }, [socket]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
            <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                <Text style={[styles.headerText, { color: theme.color }]}>{t('changePasswordText')}</Text>
                <View style={styles.container}>
                    <View>
                        <Text style={{ color: theme.color }}>{t('currentPasswordLabel')}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setOldPassword}
                            value={oldPassword}
                            placeholder={t('ipCurrentPassword')}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={{ color: theme.color }}>{t('newPasswordLabel')}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNewPassword}
                            value={newPassword}
                            placeholder={t('ipNewPassword')}
                            secureTextEntry={true}
                            onEndEditing={() => setPasswordError(reNewPassword == newPassword)}
                        />
                        <PasswordStrengthMeterBar password={newPassword} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: theme.color }}>{t('rePasswordLabel')}</Text>
                            {!passwordError && newPassword ? <Text style={{ color: 'red' }}>{t('passwordMatchError')}</Text> : null}
                        </View>
                        <TextInput
                            style={styles.input}
                            onChangeText={setReNewPassword}
                            value={reNewPassword}
                            placeholder={t('ipRePassword')}
                            secureTextEntry={true}
                            onEndEditing={() => setPasswordError(reNewPassword == newPassword)}
                        />
                    </View>
                </View>
                <KeyboardAvoidingView behavior="padding">
                    <TouchableOpacity
                        disabled={!passwordError}
                        onPress={() => {
                            Alert.alert(t('changePasswordText'), t('changePasswordWarning'), [
                                {
                                    text: t('dialogButtonCancel'),
                                    style: 'cancel',
                                },
                                { text: t('dialogButtonConfirm'), onPress: () => socket.send(`CHANGEPASS ${oldPassword} ${newPassword}`) },
                            ]);
                        }}
                        style={[styles.button, { backgroundColor: reNewPassword === newPassword && newPassword.length > 0 ? theme.backgroundColor : "gray" }]}>
                        <Text style={[styles.buttonText, { color: theme.color }]}>{t('changePasswordText')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ImageBackground>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: '5%',
        textAlign: 'center'
    },
    container: {
        flex: 1,
        marginHorizontal: '5%'
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#EDEADE',
        marginBottom: '5%'
    },
    button: {
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
    }
});