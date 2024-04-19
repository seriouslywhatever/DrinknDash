import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { useWebSocket } from '../WebsocketContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';

/**
 * Component to place bets in the Lobby screen
 * A bet consist of picking a suit and selecting a bet amount.
 */
export default HorsePicker = ({ onWagerValues }) => {
    const [showModal, setShowModel] = useState(false);
    const [sips, setSips] = useState(1); //minimum of 1 to be able to play
    const [suit, setSuit] = useState(4);

    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.
    const { t } = useTranslation();

    //send values to be used in Lobby screen
    const handleWager = () => {
        onWagerValues(sips, suit);
    };

    return (
        <View style={[styles.pickContainer, { backgroundColor: theme.color }]}>
            <View style={[styles.itemContainer, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity testID="diamonds-suit" onPress={() => {
                    setSuit(0);
                    setShowModel(true);
                }}>
                    <Image source={require('../assets/suits/diamonds.jpg')} style={styles.suiteImage} />
                </TouchableOpacity>
            </View>
            <View style={[styles.itemContainer, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity onPress={() => {
                    setSuit(1);
                    setShowModel(true);
                }}>
                    <Image source={require('../assets/suits/spades.jpg')} style={styles.suiteImage} />
                </TouchableOpacity>
            </View>
            <View style={[styles.itemContainer, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity onPress={() => {
                    setSuit(2);
                    setShowModel(true);
                }}>
                    <Image source={require('../assets/suits/hearts.jpg')} style={styles.suiteImage} />
                </TouchableOpacity>
            </View>
            <View style={[styles.itemContainer, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity onPress={() => {
                    setSuit(3);
                    setShowModel(true);
                }}>
                    <Image source={require('../assets/suits/clubs.jpg')} style={styles.suiteImage} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModel(false);
                }}>
                <ScrollView style={[styles.modalContainer, { backgroundColor: theme.backgroundColor }]}>
                    <View style={styles.sipsSelectorContainer}>
                        <Text style={{ fontSize: 24, color: theme.color }} testID="sipsSelectionID">{t('sipsSelectionText')}</Text>
                        <View style={{ width: '80%' }}>
                            <ScrollPicker
                                dataSource={[1, 2, 3, 4, 5, 6]}
                                onValueChange={(data, selectedIndex) => {
                                    setSips(data);
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.backgroundColor }]}
                                onPress={() => {
                                    setSips(0);
                                    setShowModel(false);
                                }}>
                                <Text style={{ color: theme.color }}>{t('dialogButtonCancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                testID="confirm-button"
                                style={[styles.modalButton, { backgroundColor: theme.backgroundColor }]}
                                onPress={() => {
                                    handleWager();
                                    socket.send("BET " + suit + " " + sips);
                                    setShowModel(false);
                                }}>
                                <Text style={{ color: theme.color }}>{t('dialogButtonConfirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    pickContainer: {
        opacity: 0.8,
        flexDirection: 'row',
        height: '65%',
        marginHorizontal: '10%',
    },
    sipsSelectorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    itemContainer: {
        flex: 1,
        borderRadius: 12,
        margin: '2%',
    },
    suiteImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain'
    },
    modalContainer: {
        marginTop: '20%',
        marginHorizontal: '10%',
        maxHeight: '40%',
    },
    modalButton: {
        padding: '8%',
        borderRadius: 12,
        justifyContent: 'center',
        margin: '5%',
        borderRadius: 1,
    }
});