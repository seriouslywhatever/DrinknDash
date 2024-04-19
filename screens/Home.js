import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground, StyleSheet, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { useWebSocket } from '../WebsocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';

export default Home = ({ navigation }) => {

    const { socket } = useWebSocket();
    const [username, setUsername] = useState(" ");
    const [list, setList] = useState([]);
    const [lobbyId, setLobbyId] = useState();

    const { theme } = useTheme(); //Provider of style values based on application theme.
    const { t } = useTranslation();
    const [refreshing, setRefreshing] = useState(false);

    //Refresh list of lobbies on pull down. 
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        try {
            socket.send("LIST");
        } catch (error) {
            console.error(error);
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {

                // Handle incoming messages from the server
                var server_message = event.data.split(' ');
                if (server_message[0] == "LIST") {
                    if (server_message[1] != "undefined") {
                        const list = event.data.substring(event.data.indexOf(' ') + 1);
                        console.log(list);
                        setList(JSON.parse(list));
                    }
                } else if (server_message[0] == "LOBBY") {
                    console.log(server_message);
                    if (server_message[1]) {
                        navigation.navigate("Lobby", { id: server_message[1] });
                    } else {
                        navigation.navigate("Lobby", { id: lobbyId });
                    }
                }
            };
        }

        //Ensures username retrieved which is used for game creation 
        retrieveUser = async () => {
            try {
                const usernameHolder = await AsyncStorage.getItem('username');
                if (usernameHolder) {
                    setUsername(usernameHolder);
                }
            } catch (error) {
                console.error(error);
            }
        }
        //populate list of lobbies on launch.
        retrieveLobbies = async () => {
            try {
                socket.send("LIST");
            } catch (error) {
                console.error(error);
            }
        }
        retrieveUser();
        retrieveLobbies();

    }, [lobbyId]);

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            onPress={() => {
                socket.send("JOIN " + JSON.stringify(item.id));
                setLobbyId(item.id);
            }}
            style={[styles.itemContainer, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.itemTitleContainer}>
                <Text numberOfLines={1} style={[styles.itemTitleText, { color: theme.color }]}>{item.title}</Text>
            </View>
            <View style={styles.playersContainer}>
                <View>
                    <Text style={[styles.playerCountText, { color: theme.color }]}>{item.total_player}</Text>
                </View>
                <Text style={{ color: theme.color }}>{t('playersText')}</Text>
            </View>
        </TouchableOpacity>
    ), []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
                <View style={{ flex: 1 }}>
                    <ImageBackground source={theme.backgroundImage} style={styles.backgroundImage}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Settings")}
                            style={styles.settingsButton}>
                            <Image source={require('../assets/settings.jpg')} style={styles.settingsImage} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    const usernameHolder = await AsyncStorage.getItem('username');
                                    if (usernameHolder) {
                                        await AsyncStorage.removeItem('username');
                                        socket.send("LOGOUT");
                                        navigation.replace("Login");
                                    }
                                } catch (error) {
                                    console.error('Error storing credentials:', error);
                                }
                            }}
                            style={styles.logoutButton}>
                            <Text style={{ color: theme.color }}>{t('logoutText')}</Text>
                        </TouchableOpacity>
                        <Text style={[styles.headerText, { color: theme.color }]}>{t('lobbiesText')}</Text>
                        <Text style={{ color: theme.color }}>{username}</Text>
                    </ImageBackground>
                </View>
                <View style={styles.hr} />
                <View style={{ flex: 6 }}>
                    <FlatList
                        data={list}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            if (socket && socket.readyState === WebSocket.OPEN) {
                                socket.send("CREATE " + JSON.stringify({ username: username }));
                            }
                        }}
                        style={[styles.button, { backgroundColor: theme.backgroundColor }]}>
                        <Text style={[styles.buttonText, { color: theme.color }]}>{t('createLobbyText')}</Text>
                    </TouchableOpacity>
                </View >
            </View>
        </SafeAreaView >
    )
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    settingsButton: {
        position: 'absolute',
        top: '5%',
        left: '2%'
    },
    settingsImage: {
        height: 30,
        width: 30
    },
    logoutButton: {
        position: 'absolute',
        top: '5%',
        right: '2%'
    },
    headerText: {
        fontSize: 32,
        fontWeight: '500',
    },
    hr: {
        borderWidth: 2,
        width: '100%'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '5%',
        right: '5%'
    },
    button: {
        borderRadius: 50,
        padding: 20,
        opacity: 0.8,
        borderWidth: 1
    },
    buttonText: {
        textAlign: 'center', fontSize: 16
    },
    itemTitleContainer: {
        flex: 6,
        justifyContent: 'center',
        marginStart: '5%'
    },
    itemContainer: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
    },
    itemTitleText: {
        fontSize: 22,
        fontWeight: '500',
    },
    playersContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '5%',
        alignItems: 'center'
    },
    playerCountText: {
        fontSize: 18,
        textAlign: 'center',
        padding: 5,
        borderWidth: 1
    }
});