import React, {useState, useEffect, useContext} from 'react';
import {View,FlatList, TouchableOpacity,StyleSheet,Text, TextInput, SafeAreaView, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import CommentCard from '../components/CommentCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {windowHeight, windowWidth} from '../utils/Dimensions';


import { AuthContext } from '../navigation/AuthProvider';

const CommentScreen = ({route}) => {

    console.log(route.params.postImg);

    const {postId,postImg,postText} = route.params;
    const {user} = useContext(AuthContext);
    const [text, setText] = useState(null);
    const [comments, setComments] = useState(null);
    const [flag,setFlag] = useState(true);
    
    const list = [];    

    useEffect(() => {

        
        const fetchComments = async() => {
            try {
                //const list = [];
                await firestore()
                .collection('flightPosts')
                .doc(postId)
                .collection('comments')
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach(doc => {
                        const {text,user,postTime} = doc.data();
                        list.push({
                            id: doc.id,
                            text,
                            user,
                            postTime
                        });
                    })
                    
                })  
                setComments(list);
                console.log(list);
            } catch(e) {
                console.log(e);
            }
        }
        fetchComments();
    },[flag]);

    const onCommandSend = () => {
        firestore()
        .collection('flightPosts')
        .doc(postId)
        .collection('comments')
        .add({
            text,
            user: user.uid,
            postTime: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });
        setFlag(!flag);
    }

    return (
        
        <SafeAreaView style={{flex: 1}}>
            { postImg ?
                <Image style={styles.image} source={{uri: postImg}}/>
                : 
                <Text>{postText}</Text>
            }
    
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <TextInput 
                        placeholder="Type a comment"
                        style={styles.textInput}
                        multiline
                        onChangeText={(text) => setText(text)}
                        value={text}
                    />
                </View>
                { text ?
                    <TouchableOpacity onPress={onCommandSend}>
                        <View style={styles.buttonContainer}>
                        <MaterialIcons name="send" size={28} color="white" />
                        </View>
                    </TouchableOpacity>
                    : null
                }

            </View>
            <FlatList
                style={{flex:1}}
                data={comments}
                keyExtractor={(item) => item.id} 
                ItemSeparatorComponent={() => {
                    return (
                      <View style={styles.separator}/>
                    )
                  }}
                renderItem={({item}) =><CommentCard key={item.id} item={item}>{item.text}</CommentCard>}
            />
        </SafeAreaView>
    );
}

export default CommentScreen;

const styles = StyleSheet.create({

    separator: {
      height: 1,
      backgroundColor: "#CCCCCC"
    },
    container: {
        flexDirection: 'row',
        margin: 10,
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
                                       