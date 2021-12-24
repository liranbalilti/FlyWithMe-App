import React,{useContext,useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import MessageCard from '../components/MessageCard';
import ChatScreen from '../screens/ChatScreen';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-1.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];


const MessagesScreen = ({navigation}) => {

  const {user} = useContext(AuthContext);
  const [mates,setMates] = useState(null);

  useEffect(() => {
    const fetchChatFriends = async() => {
        try {
            const list = [];
            await firestore()
            .collection('chats')
            .where("sender1","==",user.uid)
            .get()
            .then((querySnapShot) => {
                querySnapShot.forEach(doc => {
                    const {sender2,messageTime,messageText} = doc.data();
                    list.push({
                        id: doc.id,
                        mateId: sender2,
                        messageTime,
                        messageText,
                    });
                })
            })  
            await firestore()
            .collection('chats')
            .where("sender2","==",user.uid)
            .get()
            .then((querySnapShot) => {
                querySnapShot.forEach(doc => {
                    const {sender1,messageTime,messageText} = doc.data();
                    list.push({
                        id: doc.id,
                        mateId: sender1,
                        messageTime,
                        messageText,
                    });
                })
            })  
            console.log(list);
            setMates(list); 

        } catch(e) {
            console.log(e);
        }
    }
    fetchChatFriends();
},[]);
    return (
      <Container>
      <FlatList
        style={{flex:1}}
        data={mates}
        keyExtractor={(item) => item.id} 
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
      renderItem={({item}) =><MessageCard key={item.id} item={item} navigation={navigation}>hello</MessageCard>}
      />
      </Container>
    );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});