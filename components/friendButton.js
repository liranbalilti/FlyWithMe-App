import React,{useState,useEffect} from 'react';
import moment from 'moment';
import {View,Text,StyleSheet,TouchableOpacity,Image,FlatList,SafeAreaView,StatusBar,Button} from 'react-native';
import {Card,UserImg, UserInfo, UserName,PostText,PostTime,UserInfoText,PostImg,InteractionWrapper,Interaction, InteractionText, Divider} from '../styles/FeedStyles';
import firestore from '@react-native-firebase/firestore';


const friendButton = () => {

    const [friendRequestCheck,setFriendRequest] = useState(false);
    const {user,logout} = useContext(AuthContext);

    

    const checkfriendRequest = async() => {
        console.log(user.uid);
        console.log(route.params.userId);
        try {
        await firestore()
        .collection('friendRequests')
        .where("sender","==",user.uid)
        .where("receiver","==",item.userId)
        .get()
        .then((querySnapShot) => {
          if(querySnapShot.size > 0 )
            setFriendRequest(true);
        })  
        } catch(e) {
          console.log(e);
        }
      }

    useEffect(() => {
        //checkfriendRequest();
    }, []);

    return (
        <TouchableOpacity onPress={() => {}}>
        <Text>Message</Text>
      </TouchableOpacity>

    )
};

export default friendButton;


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
                                       