import React,{useContext,useEffect, useState} from 'react';
import {SafeAreaView,StyleSheet,ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import PostCard from '../components/PostCard';

import ActionButton from 'react-native-action-button';



const FlightFeed = ({ route, navigation }) => {


    const {user} = useContext(AuthContext);
    const {destination,startDate,endDate} = route.params;
    const [results,setResults] = useState([]);
    const list = [];    

    const filterByDates = (results,startDate,endDate) => {
        return results.filter(res => {
            return startDate<res.endDate && res.startDate<endDate;
        });
    };


    useEffect(() => {
        const fetchPosts = async() => {
            try {
                //const list = [];
                await firestore()
                .collection('flightPosts')
                .where("destination","==",destination)
                .get()
                .then((querySnapshot) => {
                     console.log('Total Posts: ', querySnapshot.size);
          
                    querySnapshot.forEach((doc) => {
                      const {
                        userId,
                        startDate,
                        endDate,
                        post,
                        postImg,
                        postTime,
                        likes,
                        comments,
                      } = doc.data();
                      list.push({
                        id: doc.id,
                        userId,
                        userName: 'Test Name',
                        userImg:
                          'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                        postTime: postTime,
                        startDate,
                        endDate,
                        post,
                        postImg,
                        liked: false,
                        likes,
                        comments,
                      });
                    });
                  });
                setResults(filterByDates(list,startDate,endDate));

            } catch(e) {
                console.log(e);
            }
        }
        fetchPosts();
    },[]);

    return (
        <SafeAreaView>
            <ScrollView>
           {results.map((item) => (
              <PostCard 
                key={item.id} 
                item={item} 
                navigation={navigation} 
                onPress={()=>navigation.navigate('HomeProfile', {userId:item.userId})}
                onPress2={()=>navigation.navigate('CommentScreen', {postId:item.id,postImg:item.postImg,postText:item.post})
                }
              />
            ))} 
            </ScrollView>
            <ActionButton
                buttonColor="rgba(0,0,0,1)"
                onPress={()=>navigation.navigate('addPost', {
                    destination: destination, 
                    startDate: startDate,
                    endDate: endDate})}
            />
        </SafeAreaView>
    );

}

export default FlightFeed;


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

/*
       style={{flex:1}}
          data={results}
          keyExtractor={(item, index) => {
            return item.id;
          }} 
          renderItem={({item}) => <TouristCard key={item.id} item={item} onPress={()=> navigation.navigate('HomeProfile', {userId: item.userId})} /> }

*/