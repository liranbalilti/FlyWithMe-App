import React,{useState,useEffect} from 'react';
import moment from 'moment';
import {View,Text,StyleSheet,TouchableOpacity,Image,FlatList,SafeAreaView,StatusBar,Button} from 'react-native';
import {Card,UserImg, UserInfo, UserName,PostText,PostTime,UserInfoText,PostImg,InteractionWrapper,Interaction, InteractionText, Divider} from '../styles/FeedStyles';
import firestore from '@react-native-firebase/firestore';


const CommentCard = ({item}) => {
    const [userData, setUserData] = useState(null);
    var date = moment(item.postTime.toDate()).fromNow();
    
    const getUser = async() => {

        const currentUser = await firestore()
        .collection('users')
        .doc(item.user)
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
      <View style={styles.root}>
        <View style={styles.container}>
        <TouchableOpacity onPress={() => {}}>
          <Image style={styles.image} source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}/>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text  style={styles.name}>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</Text>
            <Text style={styles.time}>
              {date}
            </Text>
          </View>
          <Text rkType='primary3 mediumLine'>{item.text}</Text>
        </View>
        <View style={styles.separator}/>
      </View>
      </View>
    );

};

export default CommentCard;


const styles = StyleSheet.create({
    root: {
      backgroundColor: "#ffffff",
      marginTop: 4,
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
      backgroundColor: "#CCCCCC"
    },
    image:{
      width:45,
      height:45,
      borderRadius:25,
      marginLeft:20
    },
    time:{
      fontSize:11,
      color:"#808080",
    },
    name:{
      fontSize:16,
      fontWeight:"bold",
    },
  }); 
                                       