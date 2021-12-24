import React,{useContext,useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet, FlatList ,TouchableOpacity} from 'react-native';
import ChatScreen from '../screens/ChatScreen';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
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

const MessageCard = ({item,navigation}) => {

    const [userData, setUserData] = useState(null);
    
    const getUser = async() => {
        console.log('here:');
        console.log(item.id);
        const currentUser = await firestore()
        .collection('users')
        .doc(item.mateId)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        })
        console.log(userData);
    }

    useEffect(() => {
        getUser();
    }, []);

return (
    <Card key={item.mateId}>
    <TouchableOpacity onPress={()=>navigation.navigate('ChatScreen', {chatId:item.id,name: userData.fname, avatar: userData.userImg,mateId: item.mateId})}>
    <UserInfo>
      <UserImgWrapper>
        <UserImg source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}} />
      </UserImgWrapper>
      <TextSection>
        <UserInfoText>
        <UserName>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</UserName>
        </UserInfoText>
        <MessageText>{item.messageText}</MessageText>
       </TextSection>
    </UserInfo>
    </TouchableOpacity>
  </Card>
)
}


export default MessageCard;