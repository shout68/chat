import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import io from 'socket.io-client';

const SERVER_URL = 'http://192.168.0.208:3000'; // Замените на IP вашего сервера

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  console.log(username);
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('message', (message) => {
      setChatHistory((prevChat) => [...prevChat, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { text: message, user: username };
      setChatHistory((prevChat) => [...prevChat, newMessage]);
      socket.emit('message', newMessage);
      setMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.user === username ? styles.leftMessage : styles.rightMessage]}>
      <Text style={styles.messageText}>{item.user}:{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.chatContainer}>
        <FlatList
          data={chatHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    marginTop: 200,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
  },
  leftMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0e0e0',
  },
  rightMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2db7ff',
  },
});

export default App;
