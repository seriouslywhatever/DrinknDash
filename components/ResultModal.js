import { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Modal, Image, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const places = [
    "DNF",
    "1st Place",
    "2nd Place",
    "3rd Place",
    "4th Place"
]

const suits = [
    require('../assets/suits/diamonds.jpg'),
    require('../assets/suits/spades.jpg'),
    require('../assets/suits/hearts.jpg'),
    require('../assets/suits/clubs.jpg')
];

/**
 * Modal to display the results of a race.
 */
export default ResultModal = ({ results, show }) => {
    const [showModal, setShowModel] = useState(false); //Determine whether to show the modal or not.
    const [gameResults, setGameResults] = useState([]);

    const { theme } = useTheme(); //Provider of style values based on application theme.

    //Shows modal when value of show changes.
    useEffect(() => {
        if (results.length) {
            setGameResults(results);
            setShowModel(show);
        }
    }, [results, show]);

    const renderItem = useCallback(({ item }) => (
        <View style={[styles.listItemContainer, { backgroundColor: item.place === 1 ? '#FFD700' : (item.place === 2 ? '#C0C0C0' : 'transparent') }]}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, color: theme.color }}>{places[item.place]}</Text>
            </View>
            <Image source={suits[item.suit]} style={styles.listItemImage} />
        </View>
    ), []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModel(false);
            }}>
            <ImageBackground source={theme.backgroundImage} style={styles.imageBackground}>
                <View>
                    <View>
                        <Text style={[styles.headerText, { color: theme.color }]}>SCOREBOARD</Text>
                    </View>
                    <View>
                        <FlatList
                            data={gameResults}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <View style={styles.buttonCloseContainer}>
                        <TouchableOpacity onPress={() => {
                            setShowModel(false);
                        }}>
                            <Text style={{ fontSize: 24, color: theme.color }}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        marginHorizontal: '20%',
        borderWidth: 1
    },
    headerText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: '5%'
    },
    listItemContainer: {
        padding: 8,
        width: '100%',
        borderWidth: 1,
        flexDirection: "row"
    },
    listItemImage: {
        height: 20,
        width: 20
    },
    buttonCloseContainer: {
        position: 'absolute',
        right: '5%',
        top: '2%'
    },
});