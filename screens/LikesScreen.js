import React, {useState, useEffect, useContext} from 'react';
import {View,FlatList, TouchableOpacity,StyleSheet,Text, TextInput, SafeAreaView, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LikesCard from '../components/LikesCard';
import CommentCard from '../components/CommentCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



import { AuthContext } from '../navigation/AuthProvider';

const LikesScreen = ({route}) => {

    const { postId } = route.params;
    const [likes, setLikes] = useState(null);

    
    const list = [];    

    useEffect(() => {
        const fetchLikes = async() => {
            try {
                //const list = [];
                await firestore()
                .collection('flightPosts')
                .doc(postId)
                .collection('likes')
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach(doc => {
                        list.push({
                            id: doc.id,
                        });
                    })
                    
                })  
                console.log(list);
                setLikes(list);
            } catch(e) {
                console.log(e);
            }
        }
        fetchLikes();
    },[]);

    return (

        <FlatList
            //columnWrapperStyle={styles.container}
            style={styles.listContainer}
            data={likes}
            //numColumns={4}
            keyExtractor={(item) => item.id} // Here was the error
            renderItem={({item}) => <LikesCard style={{width: '45%'}} item={item.id} /> }
        />
    );
}

export default LikesScreen;

const styles = StyleSheet.create({

    listContainer: {
      backgroundColor: "#ffffff",
    },
    container: {
        marginRight: 303,
    },
    textContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 25,
        marginRight: 10,
        flex: 1,
        alignItems: 'flex-end',
      },
      buttonContainer: {
        backgroundColor: 'black',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      textInput: {
        flex: 1,
        marginHorizontal: 10,
      },
      image: {
        width: '100%',
        height: 250,
      },
  }); 
                                       