import { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Modal } from 'react-native';
import { useWebSocket } from '../WebsocketContext';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';

/**
 * Messaging component in Lobby screen.
 */
export default ChatBox = ({ messages }) => {
    const [showModal, setShowModel] = useState(false);
    const [text, setText] = useState();
    const [list, setList] = useState([]);
    const [refresh, setRefresh] = useState([]);

    const { socket } = useWebSocket();
    const { theme } = useTheme(); //Provider of style values based on application theme.

    const renderItem = useCallback(({ item }) => (
        <View style={{ borderBottomColor: theme.color, borderBottomWidth: 1 }}>
            <Text style={{ color: theme.color, fontSize: 16 }}>{item.username}: {item.message.toString()}</Text>
        </View>
    ), []);

    //Send messages to users in a lobby.
    const handleSubmit = () => {
        socket.send("MSG " + text);
        setText("");
    };

    //Rerender component on every new message.
    useEffect(() => {
        if (messages.length) {
            setList([...list, messages[0]]);
        }
    }, [messages]);

    return (
        <TouchableOpacity style={{ flex: 1, backgroundColor: theme.backgroundColor, opacity: 0.85, margin: '3%', marginBottom: '8%' }}
            onPress={() => setShowModel(true)}>
            <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={refresh}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModel(false);
                }}>
                <View style={{ backgroundColor: theme.backgroundColor, opacity: 0.85, height: '100%' }}>
                    <View style={{ position: 'absolute', right: '5%', top: '5%' }}>
                        <TouchableOpacity onPress={() => setShowModel(false)}>
                            <Text style={{ fontSize: 24, color: 'gray' }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ margin: '10%' }}
                        data={list}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={refresh}
                    />
                    <View style={{ flexDirection: 'row', margin: '10%' }}>
                        <View style={{ borderRadius: 12, flex: 3 }}>
                            <TextInput
                                style={{ backgroundColor: 'white', padding: '5%' }}
                                onChangeText={setText}
                                value={text}
                                multiline={true}
                                onSubmitEditing={() => { handleSubmit }}
                                placeholder="Enter text..."
                                returnKeyType="done" />
                        </View>
                        <View style={{ flex: 1, padding: 10, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={handleSubmit}>
                                <Text>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity >
    );
}

