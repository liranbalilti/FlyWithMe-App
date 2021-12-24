import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button, StyleSheet} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const ChatScreen = ({route}) => {
  
  const [messages, setMessages] = useState([]);
  const {chatId,name,avatar,mateId} = route.params;

  useEffect(() => {
          
            console.log(chatId);
            const list = [];
            const fetchMessages = async() => {
            try {
                //const list = [];
                await firestore()
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .orderBy('msgTime', 'desc')
                .get()
                .then((querySnapShot) => {
                    console.log(querySnapShot);
                    querySnapShot.forEach(doc => {
                        const {text,msgTime} = doc.data();
                        list.push({
                            _id: doc.id,
                            text,
                            createdAt: moment(msgTime.toDate()).fromNow(), 
                            user: {
                              _id: mateId,
                              name: name,
                              avatar: avatar,
                            }
                        });
                    })
                    
                })  
                setMessages(list);
                console.log(list);
            } catch(e) {
                console.log(e);
            }
        }
        fetchMessages();
  }, []);

  const onSend = useCallback((messages = []) => {

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    firestore()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .add({
      text: messages[0].text,
      msgTime: firestore.Timestamp.fromDate(new Date()),
    })
      .then(() => {
      })
      .catch((err) => {
          console.log('Something went wrong with adding flight to firebase ',err);
      });

  }, []);

  const renderSend = (props) => {

    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});