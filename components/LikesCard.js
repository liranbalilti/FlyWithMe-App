import React,{useState,useEffect} from 'react';
import moment from 'moment';
import {View,Text,StyleSheet,TouchableOpacity,Image,FlatList,SafeAreaView,StatusBar,Button} from 'react-native';
import {Card,UserImg, UserInfo, UserName,PostText,PostTime,UserInfoText,PostImg,InteractionWrapper,Interaction, InteractionText, Divider} from '../styles/FeedStyles';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';


const LikesCard = ({item}) => {

    const [userData, setUserData] = useState(null);
    console.log(item);
    
    const getUser = async() => {

        const currentUser = await firestore()
        .collection('users')
        .doc(item)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        })
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}/> 
            <Ionicons style={styles.root} name="heart" size={25} color='#2e64e5'/>
            <Text style={styles.name}>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</Text>
            <View style={styles.separator}/>
        </View>
    
    );

};

export default LikesCard;


const styles = StyleSheet.create({
    root: {
      marginTop: 24,
      marginLeft: -14,
    },
    container: {
      paddingRight: 16,
      paddingVertical: 12,
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
      backgroundColor: "#CCCCCC",
    },
    image:{
      width:45,
      height:45,
      borderRadius:25,
      marginLeft: 20
    },
    name:{
      fontSize:16,
      fontWeight:"bold",
      marginTop: 16,
      marginLeft:12,
    },
  }); 
                                       