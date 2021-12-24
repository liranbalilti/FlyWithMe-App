import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {UserImg} from '../styles/FeedStyles';
import firestore from '@react-native-firebase/firestore';

const TouristCard = ({item,onPress}) => {

  const [userData, setUserData] = useState(null);
  
  const getUser = async() => {

    const currentUser = await firestore()
    .collection('users')
    .doc(item.userId)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        setUserData(documentSnapshot.data());
      }
    })
}
    useEffect(() => {
      getUser();
      console.log(item.userId);
    }, []);

    return (   
        <View key={item.id} style={styles.listItem} >
          <UserImg  source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}/>
          <View style={{alignItems:"center",flex:1}}>
            <TouchableOpacity onPress={onPress}>
            <Text style={{fontWeight:"bold"}}>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</Text>
            </TouchableOpacity>
            <Text style={{fontWeight:"bold"}}>{userData ? userData.age : '0'}</Text>
            <Text>{item.startDate}-{item.endDate}</Text>
            <Text>{item.flightDesc}</Text>
          </View>
          <Text style={{color:"blue"}}>View Profile</Text>
        </View>
    );
    
};

export default TouristCard;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60
    },
    listItem:{
      margin:10,
      padding:10,
      backgroundColor:"#FFF",
      width:"100%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    }
  });