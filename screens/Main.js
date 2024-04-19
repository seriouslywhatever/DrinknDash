import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, ImageBackground, FlatList, Image } from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useTheme } from '../ThemeContext';
import Horse from '../components/Horse';
import ResultModal from '../components/ResultModal';

/**
 * Images sources for cards.
 * cardback is for face down cards.
 * CARD_IMAGES for turned over cards.
 */
const CARD_IMAGES = [
    null,
    null, //removed ace
    require('../assets/cards/2.png'),
    require('../assets/cards/3.png'),
    require('../assets/cards/4.png'),
    require('../assets/cards/5.png'),
    require('../assets/cards/6.png'),
    require('../assets/cards/7.png'),
    require('../assets/cards/8.png'),
    require('../assets/cards/9.png'),
    require('../assets/cards/10.png'),
    require('../assets/cards/11.png'),
    require('../assets/cards/12.png'),
    require('../assets/cards/13.png'),
    null, //removed ace
    require('../assets/cards/15.png'),
    require('../assets/cards/16.png'),
    require('../assets/cards/17.png'),
    require('../assets/cards/18.png'),
    require('../assets/cards/19.png'),
    require('../assets/cards/20.png'),
    require('../assets/cards/21.png'),
    require('../assets/cards/22.png'),
    require('../assets/cards/23.png'),
    require('../assets/cards/24.png'),
    require('../assets/cards/25.png'),
    require('../assets/cards/26.png'),
    null, //removed ace
    require('../assets/cards/28.png'),
    require('../assets/cards/29.png'),
    require('../assets/cards/30.png'),
    require('../assets/cards/31.png'),
    require('../assets/cards/32.png'),
    require('../assets/cards/33.png'),
    require('../assets/cards/34.png'),
    require('../assets/cards/35.png'),
    require('../assets/cards/36.png'),
    require('../assets/cards/37.png'),
    require('../assets/cards/38.png'),
    require('../assets/cards/39.png'),
    null, //removed ace
    require('../assets/cards/41.png'),
    require('../assets/cards/42.png'),
    require('../assets/cards/43.png'),
    require('../assets/cards/44.png'),
    require('../assets/cards/45.png'),
    require('../assets/cards/46.png'),
    require('../assets/cards/47.png'),
    require('../assets/cards/48.png'),
    require('../assets/cards/49.png'),
    require('../assets/cards/50.png'),
    require('../assets/cards/51.png'),
    require('../assets/cards/52.png'),
]
const cardback = require('../assets/cardback.jpg');

export default Main = ({ navigation, route }) => {

    //Provider of style values based on application theme.
    const { theme } = useTheme();

    /**
     * Variable For tracking purposes.
    */

    //Game Progression.
    const [results, setResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    let placesVisited = [0, 0, 0, 0, 0, 0, 0, 0];
    let HOLDER = 0;
    let diamondPlace = 0;
    let spadePlace = 0;
    let heartPlace = 0;
    let clubPlace = 0;

    //Penalties.
    let penaltyDrawn = 0;
    const viewRef = useRef(null);
    const [drawnCard, setDrawnCard] = useState(cardback);
    const [penaltyCard1, setPenaltyCard1] = useState(cardback);
    const [penaltyCard2, setPenaltyCard2] = useState(cardback);
    const [penaltyCard3, setPenaltyCard3] = useState(cardback);
    const [penaltyCard4, setPenaltyCard4] = useState(cardback);
    const [penaltyCard5, setPenaltyCard5] = useState(cardback);
    const [penaltyCard6, setPenaltyCard6] = useState(cardback);

    const PENALTY = [
        {
            id: 1,
            source: penaltyCard1,
        },
        {
            id: 2,
            source: penaltyCard2,
        },
        {
            id: 3,
            source: penaltyCard3,
        },
        {
            id: 4,
            source: penaltyCard4,
        },
        {
            id: 5,
            source: penaltyCard5,
        },
        {
            id: 6,
            source: penaltyCard6,
        },
    ];

    //Object display & movement.
    const diamondDistance = useSharedValue(0);
    const spadeDistance = useSharedValue(0);
    const heartDistance = useSharedValue(0);
    const clubDistance = useSharedValue(0);
    const [size, setSize] = useState();
    const [horseMargin, setHorseMargin] = useState();

    useEffect(() => {
        async function setScreenOrientation() {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }

        async function unlockScreenOrientation() {
            await ScreenOrientation.unlockAsync();
        }

        //Game should be played in Lanscape mode.
        setScreenOrientation();

        /**
         * Every game is assigned a random port. route.params.port
         * ws://192.168.2.2 IPv4 Address.
         */
        const ws = new WebSocket(`ws://192.168.2.2:${route.params.port}`);

        //Game is automatically started when the screen is navigated to. 
        ws.onopen = () => {
            console.log('Game connection opened');
            ws.send("DRAW");
        };

        ws.onmessage = (event) => {
            var server_message = event.data.split(' ');
            switch (server_message[0]) {
                //Receive card from the server and move corresponding Horse object.
                case 'DRAW':
                    setDrawnCard(CARD_IMAGES[server_message[1]]);
                    switch (parseInt(server_message[2])) {
                        case 1:
                            diamondDistance.value += HOLDER;
                            diamondPlace++;
                            placesVisited[diamondPlace] += 1;
                            break;
                        case 2:
                            spadeDistance.value += HOLDER;
                            spadePlace++;
                            placesVisited[spadePlace] += 1;
                            break;
                        case 3:
                            heartDistance.value += HOLDER;
                            heartPlace++;
                            placesVisited[heartPlace] += 1;
                            break;
                        case 4:
                            clubDistance.value += HOLDER;
                            clubPlace++;
                            placesVisited[clubPlace] += 1;
                            break;
                        default: console.log(server_message[2]);
                            break;
                    }

                    if (placesVisited.includes(4)) {
                        //If each horse object has crossed a certain threshold, a penalty card should be drawn.
                        placesVisited.splice(placesVisited.indexOf(4), 1, 0);
                        setTimeout(() => {
                            ws.send("PENALTY");
                        }, 1000);
                    } else {
                        //Game should end if an object has moved up 7 times. 
                        if (placesVisited[7] < 1) {
                            setTimeout(() => {
                                ws.send("DRAW");
                            }, 1000);
                        } else {
                            const placements = [diamondPlace, spadePlace, heartPlace, clubPlace].sort();

                            const raceResults = [
                                {
                                    id: 1,
                                    place: (4 - placements.lastIndexOf(diamondPlace)),
                                    suit: 0
                                },
                                {
                                    id: 2,
                                    place: (4 - placements.lastIndexOf(spadePlace)),
                                    suit: 1
                                },
                                {
                                    id: 3,
                                    place: (4 - placements.lastIndexOf(heartPlace)),
                                    suit: 2
                                },
                                {
                                    id: 4,
                                    place: (4 - placements.lastIndexOf(clubPlace)),
                                    suit: 3
                                },
                            ];

                            //Winning horse is moved to first index and server is notified to end the game. 
                            raceResults.sort((a, b) => a.place - b.place);
                            setResults(raceResults);
                            ws.send(`END ${JSON.stringify(raceResults)}`);

                            setTimeout(() => {
                                setShowModal(true);
                            }, 1000);
                        }
                    }
                    break;
                //Display penalty card at correct location
                case 'PENALTY':
                    penaltyDrawn++;
                    switch (penaltyDrawn) {
                        case 1:
                            setPenaltyCard1(CARD_IMAGES[server_message[1]]);
                            break;
                        case 2:
                            setPenaltyCard2(CARD_IMAGES[server_message[1]]);
                            break;
                        case 3:
                            setPenaltyCard3(CARD_IMAGES[server_message[1]]);
                            break;
                        case 4:
                            setPenaltyCard4(CARD_IMAGES[server_message[1]]);
                            break;
                        case 5:
                            setPenaltyCard5(CARD_IMAGES[server_message[1]]);
                            break;
                        case 6:
                            setPenaltyCard6(CARD_IMAGES[server_message[1]]);
                            break;
                        default:
                            console.log(penaltyDrawn)
                            break;
                    }
                    //Card drawn as punishment moves Horse object backwards.
                    switch (parseInt(server_message[2])) {
                        case 1:
                            diamondDistance.value -= HOLDER;
                            placesVisited[diamondPlace] -= 1;
                            diamondPlace--;
                            placesVisited[diamondPlace] += 1;
                            break;
                        case 2:
                            spadeDistance.value -= HOLDER;
                            placesVisited[spadePlace] -= 1;
                            spadePlace--;
                            placesVisited[spadePlace] += 1;
                            break;
                        case 3:
                            heartDistance.value -= HOLDER;
                            placesVisited[heartPlace] -= 1;
                            heartPlace--;
                            placesVisited[heartPlace] += 1;
                            break;
                        case 4:
                            clubDistance.value -= HOLDER;
                            placesVisited[clubPlace] -= 1;
                            clubPlace--;
                            placesVisited[clubPlace] += 1;
                            break;
                        default: console.log(server_message[2]);
                            break;
                    }

                    setTimeout(() => {
                        ws.send("DRAW");
                    }, 1000);

                    break;
                case 'ENDSCREEN':
                    /**
                     * Navigating user back to lobby after game ends.
                     * Postgame: For conditional behaviour in lobby screen.
                     * id: Retrieve users and bets in Lobby.
                     * winner: to determine winners.
                     * losers: to populate list of losers in Lobby.
                     */
                    navigation.navigate('Lobby', { postgame: true, id: server_message[1], winner: server_message[2], losers: server_message[3] });
                    break;
                default:
                    console.log(server_message[0]);
                    break;
            }
        }

        ws.onclose = () => {
            console.log('Game connection closed!');
        };

        return () => {
            ws.close();
            unlockScreenOrientation();
        };
    }, []);

    const renderItem = useCallback(({ item }) => (
        <View style={{ justifyContent: 'center' }}>
            <View style={styles.penaltyItemContainer}>
                <Image source={item.source} style={styles.penaltyImage} resizeMode='contain' />
            </View>
        </View>
    ), []);

    //Retrieve width and height of view for responsive design.
    const onLayoutHandler = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setSize(height * 0.38);
        setHorseMargin(0 - (height * 0.14));
        HOLDER = width * 0.1;
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 5 }} ref={viewRef} onLayout={onLayoutHandler}>
                <Image source={theme.fenceImage} style={{ height: '10%', width: '100%' }} resizeMode='repeat' />
                <ImageBackground style={{ flex: 1 }} source={theme.trackImage} resizeMode='repeat'>
                    <View style={{ flexDirection: 'row', marginTop: horseMargin }}>
                        <View style={{ flex: 7 }}>
                            <Horse distance={diamondDistance} size={size} />
                        </View>
                        <View style={styles.suitImageContainer}>
                            <Image source={require('../assets/suits/diamonds.jpg')} style={styles.suitImage} resizeMode='contain' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: horseMargin }}>
                        <View style={{ flex: 7 }}>
                            <Horse distance={spadeDistance} size={size} />
                        </View>
                        <View style={styles.suitImageContainer}>
                            <Image source={require('../assets/suits/spades.jpg')} style={styles.suitImage} resizeMode='contain' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: horseMargin }}>
                        <View style={{ flex: 7 }}>
                            <Horse distance={heartDistance} size={size} />
                        </View>
                        <View style={styles.suitImageContainer}>
                            <Image source={require('../assets/suits/hearts.jpg')} style={styles.suitImage} resizeMode='contain' />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: horseMargin }}>
                        <View style={{ flex: 7 }}>
                            <Horse distance={clubDistance} size={size} />
                        </View>
                        <View style={styles.suitImageContainer}>
                            <Image source={require('../assets/suits/clubs.jpg')} style={styles.suitImage} resizeMode='contain' />
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={{ flex: 3 }}>
                <ImageBackground source={theme.backgroundImage} style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 5 }}>
                        <FlatList
                            data={PENALTY}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={PENALTY}
                            horizontal={true}
                            contentContainerStyle={styles.penaltyContainer}
                        />
                    </View>
                    <View style={{ flex: 1 }} />
                </ImageBackground>
            </View>
            <View style={styles.cardContainer}>
                <Image source={drawnCard} style={styles.cardImage} resizeMode='contain' />
            </View>
            <ResultModal results={results} show={showModal} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: 'black',
        opacity: 0.7,
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        padding: 5
    },
    suitImageContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    suitImage: {
        height: '27%',
        width: '27%',
    },
    penaltyContainer: {
        flex: 1,
        justifyContent: "space-between",
        marginHorizontal: '10%'
    },
    cardImage: {
        height: 100, width: 100
    },
    penaltyItemContainer: {
        backgroundColor: 'black',
        opacity: 0.7,
        justifyContent: 'center',
        borderRadius: 5
    },
    penaltyImage: {
        height: 70,
        width: 70
    }
});