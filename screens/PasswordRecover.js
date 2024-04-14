import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, ToastAndroid, Alert } from 'react-native';
import { useWebSocket } from '../WebsocketContext';
import I18n from 'react-native-i18n';
import { useTheme } from '../ThemeContext';

export default PasswordRecover = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.

    useEffect(() => {
        //Display toasts to inform user
        if (socket) {
            socket.onmessage = (event) => {
                if (event.data == "CORRECT") {
                    ToastAndroid.show('Password has been updated', ToastAndroid.LONG);
                } else if (event.data == "INCORRECT") {
                    ToastAndroid.show('Incorrect password provided', ToastAndroid.LONG);
                }
            }
        }
    }, [socket]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'} >
            <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                <View style={styles.container}>
                    <View>
                        <Text style={[styles.headerText, { color: theme.color }]}>{I18n.t('getAccountBackText')}</Text>
                    </View>
                    <Text style={{ color: theme.color }}>{I18n.t('recoverEmailLabel')}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        value={email}
                        placeholder={I18n.t('ipEmail')}
                    />
                </View>
                <View style={[styles.button, { backgroundColor: theme.backgroundColor }]}>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(I18n.t('changePasswordText'), I18n.t('changePasswordWarning'), [
                                {
                                    text: I18n.t('dialogButtonCancel'),
                                    style: 'cancel',
                                },
                                { text: I18n.t('dialogButtonConfirm'), onPress: () => socket.send(`RESETPASS ${email}`) },
                            ]);
                        }}>
                        <Text style={[styles.buttonText, { color: theme.color }]}>{I18n.t('recoverAccountText')}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        justifyContent: 'center'
    },
    headerText: {
        marginVertical: '5%',
        fontSize: 45
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#EDEADE',
        marginBottom: '5%'
    },
    inputLabel: {
        marginVertical: '5%',
        fontSize: 45,
    },
    button: {
        position: "absolute",
        bottom: 50,
        borderRadius: 12,
        padding: 10,
        alignSelf: 'center',
        width: '75%',
    },
    buttonText: {
        fontSize: 28,
        textAlign: 'center'
    }
});