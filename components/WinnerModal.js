import { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useWebSocket } from '../WebsocketContext';
import { useTheme } from '../ThemeContext';
import I18n from 'react-native-i18n';

/**
 * Modal to send sips to users after the game ends.
 * Only seen by winners and only shows losers.
 */
export default WinnerModal = ({ losers, show, bet }) => {
    const [showModal, setShowModal] = useState(false);
    const [loserList, setLoserList] = useState([]);
    const [reward, setReward] = useState(bet); //Value of sips wagered times 2

    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.

    useEffect(() => {
        if (losers.length) {
            setLoserList(losers);
            setReward(bet * 2);
            setShowModal(show);
        }
    }, [losers, show]);

    const renderItem = useCallback(({ item }) => (
        <View style={[styles.listItemContainer, { backgroundColor: theme.backgroundColor }]}>
            <TouchableOpacity onPress={() => {
                setShowModal(false);
                socket.send(`WINNER ${JSON.stringify(item)} ${reward}`);
            }} style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, color: theme.color }}>{item.username}</Text>
            </TouchableOpacity>
        </View>
    ), [reward]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(false);
            }}>
            <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerText, { color: theme.color }]}>{I18n.t('winnerText')}</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.loserSelectText, { color: theme.color }]}>{I18n.t('loserSelectMessage')}</Text>
                    </View>
                </View>
                <Text style={[styles.totalSipsText, { color: theme.color }]}>{I18n.t('totalSipsText')} {reward}</Text>
                <View style={{ flex: 3 }}>
                    <FlatList
                        data={loserList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.userId}
                        extraData={loserList}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={[styles.buttonMercy, { backgroundColor: theme.backgroundColor }]}>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Text style={[styles.textClose, { color: theme.color }]}>{I18n.t('showMercyText')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        marginHorizontal: '10%',
        borderWidth: 1,
        flex: 1,
        marginVertical: "45%"
    },
    headerText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 40,
        marginBottom: '1%'
    },
    loserSelectText: {
        fontSize: 16,
        marginBottom: 20
    },
    totalSipsText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: '5%'
    },
    listItemContainer: {
        padding: 8,
        width: '100%',
        borderWidth: 1,
        flexDirection: "row",
    },
    buttonMercy: {
        position: "absolute",
        bottom: "40%",
        borderRadius: 12,
        padding: 10,
        alignSelf: 'center',
        width: '75%'
    },
    textClose: {
        fontSize: 24,
        textAlign: 'center'
    },

});