import React,{useState,useEffect,useContext} from 'react';
import {StyleSheet,Text,View,TouchableOpacity,Image,Button} from 'react-native';
import firestore from '@react-native-firebase/firestore';


import { AuthContext } from '../navigation/AuthProvider';
import { useCardAnimation } from '@react-navigation/stack';

const FriendRequestCard = ({senderId,flag,onPress}) => {


    const [userData, setUserData] = useState(null);
    const {user} = useContext(AuthContext);
    const [Accepted,setAccept] = useState(false);

    console.log(senderId);

    const getUser = async() => {
        await firestore()
        .collection('users')
        .doc(senderId)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            setUserData(documentSnapshot.data());
          }
        })
    }
    const AcceptRequest = async() => {

        await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('friends')
        .add({
          friendId: senderId,
        })
          .then(() => {
        
          })
          .catch((err) => {
              console.log('Something went wrong with adding flight to firebase ',err);
          });

        await firestore()
        .collection('users')
        .doc(senderId)
        .collection('friends')
        .add({
            friendId: user.uid,
        })
        .then(() => {
            
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });  
        await firestore().collection('friendRequests')
        .where("sender","==",senderId)
        .where("receiver","==",user.uid)
        .get()
        .then((querySnapShot) => {
        querySnapShot.docs[0].ref.delete();
            
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });

        await firestore().collection('chats')
        .add({
          sender1: senderId,
          sender2: user.uid,
          messageTime: '',
          messageText: '',
      })
      .then(() => {
         
      })
      .catch((err) => {
          console.log('Something went wrong with adding flight to firebase ',err);
      });
    }

    const DeleteRequest = async() => {
        await firestore().collection('friendRequests')
        .where("sender","==",senderId)
        .where("receiver","==",user.uid)
        .get()
        .then((querySnapShot) => {
            querySnapShot.docs[0].ref.delete();
        })
        .catch((err) => {
            console.log('Something went wrong deleting friend request ',err);
        });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
            <View style={styles.root}>
            <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
              <Image style={styles.image} source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}/>
            </TouchableOpacity>
            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <TouchableOpacity onPress={onPress}>
                    <Text  style={styles.name}>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userBtn} onPress={() => AcceptRequest()}>
                    <Text style={styles.userBtnTxt}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.userBtn} onPress={() => DeleteRequest()}>
                    <Text style={styles.userBtnTxt}>Decline</Text>
                  </TouchableOpacity>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
          </View>  
    );
}


export default FriendRequestCard;

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#ffffff",
        marginTop: 4,
      },
      container: {
        paddingRight: 16,
        paddingVertical: 1,
        flexDirection: 'row',
        alignItems: 'flex-start'
      },
      content: {
        marginLeft: 16,
        flex: 1,
      },
      contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
      },
      separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
      },
      image:{
        width:45,
        height:45,
        borderRadius:25,
        marginLeft:20
      },
      name:{
        fontSize:16,
        fontWeight:"bold",
      },
    userBtn: {
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 3,
      paddingVertical: 8,
      paddingHorizontal: 24,
      marginHorizontal: 5,
    },
    userBtnTxt: {
      color: "black",
    },
  });

  