import React,{useContext,useEffect, useState} from 'react';
import {SafeAreaView,StyleSheet,ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';

import ActionButton from 'react-native-action-button';
import FriendRequestCard from '../components/FriendRequestCard';



const friendRequests = ({ route,navigation }) => {


    const {user} = useContext(AuthContext);
    const [results,setRequests] = useState([]);
    const list = [];    

    console.log(user.uid);


    useEffect(() => {
  
        const fetchRequests = async() => {
            try {
                //const list = [];
                await firestore()
                .collection('friendRequests')
                .where("receiver","==",user.uid)
                .get()
                .then((querySnapshot) => {
                     console.log('Total Posts: ', querySnapshot.size);
          
                    querySnapshot.forEach((doc) => {
                      const {
                        sender,
                        requestTime,
                      } = doc.data();
                      list.push({
                        id: doc.id,
                        senderId: sender,
                        requestTime: requestTime,
                      });
                    });
                  });
                setRequests(list);

            } catch(e) {
                console.log(e);
            }
        }
        fetchRequests();
    },[]);


    return (
        <SafeAreaView>
            <ScrollView>
           {results.map((item) => (
              <FriendRequestCard
                key={item.id} 
                senderId={item.senderId} 
                onPress={()=> navigation.navigate('HomeProfile', {userId: item.senderId})}
              />
            ))} 
            </ScrollView>
        </SafeAreaView>
    );

}

export default friendRequests;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        padding: 20,
    },
      actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
    text: {
        fontSize: 20,
        color: '#333333'
    }
});
