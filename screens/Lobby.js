import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Alert, Share } from 'react-native';
import HorsePicker from '../components/HorsePicker';
import ChatBox from '../components/ChatBox';
import { useWebSocket } from '../WebsocketContext';
import WinnerModal from '../components/WinnerModal';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';

//Images of card suits.
const suits = [
    require('../assets/suits/diamonds.jpg'),
    require('../assets/suits/spades.jpg'),
    require('../assets/suits/hearts.jpg'),
    require('../assets/suits/clubs.jpg')
];

//Used to populate a list of losers to send sips to after a game.
let lOSERS = [];

export default Lobby = ({ navigation, route }) => {

    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.
    const { t } = useTranslation();

    const [list, setList] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [msgList, setMsgList] = useState([]);
    const [bet, setBet] = useState(1);
    const [suit, setSuit] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    //set values based on HorsePicker component interactions.
    const handleWagerValues = (bet, suit) => {
        setBet(bet);
        setSuit(suit);
    };

    useEffect(() => {

        setRefresh(!refresh);

        if (socket) {
            //Will trigger after screen is navigated back from Game screen.
            if (route.params?.postgame) {
                socket.send("LOBBYLIST " + route.params.id);
                socket.send("HOST");

                //Show Modal responsible for sending sips
                if (suit === parseInt(route.params.winner) && route.params.losers.length > 0) {
                    lOSERS = JSON.parse(route.params.losers);
                    setShowModal(true);
                }
                route.params.postgame = false;
            } else {
                //Retrieve users and create new game if creator of lobby.
                socket.send("LOBBYLIST " + route.params.id);
                socket.send("HOST");
            }
            socket.onmessage = (event) => {
                // Handle incoming messages from the server.
                var server_message = event.data.split(' ');
                if (server_message[0] == "LOBBYLIST") {
                    console.log(server_message);
                    console.log(server_message[1]);
                    if (server_message[1] != "undefined") {
                        // //const list = event.data.substring(event.data.indexOf(' ') + 1);
                        // const listHolder = [];
                        // listHolder.push();
                        setList(JSON.parse(server_message[1]));
                        setRefresh(!refresh);
                    }
                } else if (server_message[0] == "REFRESH") {
                    console.log(server_message);
                    //refresh user board
                    socket.send("LOBBYLIST " + route.params.id);
                } else if (server_message[0] == "MSG") {

                    const receivedString = server_message.slice(1);
                    let msgString = receivedString.join(" ");

                    const msgObject = JSON.parse(msgString);
                    setMsgList([...msgList, msgObject]);

                } else if (server_message[0] == "HOST") {
                    setIsHost(true);
                } else if (server_message[0] == "GAME") {
                    navigation.navigate("Main");
                } else if (server_message[0] == "CANCEL") {
                    navigation.replace("Home");
                } else if (server_message[0] == "LOSER") {
                    Alert.alert(
                        'LOSER',
                        `You must take ${server_message[1]} sips.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                        { cancelable: false }
                    );
                }
            };
        }

        //to remove the lobby if a host leaves. 
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (socket) {
                socket.send("WITHDRAW");
            }
        });

        return unsubscribe;

    }, [navigation, route.params?.postgame, lOSERS]);

    const renderItem = useCallback(({ item }) => (
        <View style={{ flexDirection: 'row', backgroundColor: theme.backgroundColor }}>
            <View style={[styles.scoreboardItem, { flex: 6 }]}>
                <Text numberOfLines={1} style={[styles.usernameText, { color: theme.color }]} >{item.username}</Text>
            </View>
            <View style={[styles.scoreboardItem, { backgroundColor: theme.backgroundColor }]}>
                <ImageBackground source={suits[item.suit]} resizeMode='center'>
                    <Text style={[styles.betText, { color: '#EDEADE' }]}>{item.bet}</Text>
                </ImageBackground>
            </View>
            <View style={styles.scoreboardItem}>
                <Text style={{ textAlign: 'center', color: theme.color }}>{item.wins}</Text>
            </View>
        </View>
    ), []);

    return (
        <View style={{ flex: 1 }}>
            <WinnerModal losers={lOSERS} show={showModal} bet={bet} />
            <ImageBackground source={theme.backgroundImage} style={{ height: '100%' }}>
                <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={async () => {
                        try {
                            await Share.share({
                                message: t('inviteMessage')
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }}>
                    <Text style={{ color: theme.color }}>{t('inviteText')}</Text>
                </TouchableOpacity>
                <View style={{ flex: 2, alignItems: 'center' }}>
                    <Text style={{ color: theme.color }}>{t('pickHorseText')}</Text>
                    <HorsePicker onWagerValues={handleWagerValues} />
                </View>
                <View style={[styles.playerList, { backgroundColor: theme.backgroundColor }]}>
                    <FlatList
                        data={list}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.user_id}
                        extraData={refresh}
                    />
                </View>
                <View style={styles.chatboxContainer}>
                    <ChatBox messages={msgList} />
                </View>
                <View style={styles.buttonContainer}>
                    {isHost ?
                        (
                            <TouchableOpacity
                                style={[styles.buttonReady, { backgroundColor: theme.backgroundColor }]}
                                onPress={() => {
                                    socket.send("GAME");
                                }}>
                                <Text style={[styles.buttonText, { color: theme.color }]}>{t('startText')}</Text>
                            </TouchableOpacity>
                        ) : (<View />)
                    }
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    usernameText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    betText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    inviteButton: {
        alignSelf: 'flex-end',
        marginTop: "1%",
        marginRight: "5%"
    },
    playerList: {
        flex: 3,
        marginHorizontal: '5%',
        borderWidth: 1
    },
    scoreboardItem: {
        borderWidth: 1,
        padding: '2%',
        justifyContent: 'center',
        flex: 1
    },
    chatboxContainer: {
        flex: 3,
        marginHorizontal: '5%'
    },
    buttonContainer: {
        flex: 1,
        marginHorizontal: '5%'
    },
    buttonReady: {
        borderRadius: 12,
        backgroundColor: 'white',
        alignItems: 'center',
        marginHorizontal: '10%',
        padding: '5%',
        position: 'relative',
        bottom: '25%'
    },
    buttonText: {
        fontSize: 24,
        textAlign: 'center'
    }
});