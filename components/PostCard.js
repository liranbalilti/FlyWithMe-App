import React,{useState,useEffect,useContext} from 'react';
import {StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card,UserImg, UserInfo, UserName,PostText,PostTime,UserInfoText,PostImg,InteractionWrapper,Interaction, InteractionText, Divider} from '../styles/FeedStyles';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import LikesScreen from '../screens/LikesScreen';
import CommentScreen from '../screens/CommentScreen';

import { AuthContext } from '../navigation/AuthProvider';

const PostCard = ({item,onPress,onPress2,navigation}) => {

    const [likes, setLikesCount] = useState(null);
    const {user} = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUser = async() => {

        await firestore()
        .collection('users')
        .doc(item.userId)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            setUserData(documentSnapshot.data());
          }
        })
    }

    const fetchLikesCount = async() => {
        try {
            //const list = [];
            await firestore()
            .collection('flightPosts')
            .doc(item.id)
            .collection('likes')
            .get()
            .then((querySnapShot) => {
                setLikesCount(querySnapShot.size);
            })  
        } catch(e) {
            console.log(e);
        }
    }
    const checkLiked = async() => {

        await firestore()
        .collection('flightPosts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            setLiked(true);
          }
        })
    }

    useEffect(() => {
        fetchLikesCount();
        getUser();
        checkLiked();
    }, [liked]);

    const addLike = async() => {
        await firestore().collection('flightPosts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .set({
        })
      .then(() => {
          console.log('Flight Added Successfully!');
      })
      .catch((err) => {
          console.log('Something went wrong with adding flight to firebase ',err);
      });
      setLiked(true);
    }

    const dislike = async() => {
        var likeId = 
        await firestore().collection('flightPosts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .delete()
        .then(() => {
      
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });
      setLiked(false);
    }
    
    return (
        <Card key={item.id}>
        <UserInfo>
            <UserImg source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}/>
            <UserInfoText>
                <TouchableOpacity onPress={onPress}>
                    <UserName>{userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }</UserName>
                </TouchableOpacity>
                <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
            </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg != null ? <PostImg source={{uri:item.postImg}}/> : <Divider />} 
        <InteractionWrapper>
            <Interaction active={item.liked}>
                {liked ? <Ionicons onPress={dislike} name="heart" size={25} color='#2e64e5'/> : <Ionicons onPress={addLike}name="heart-outline" size={25} color='#2e64e5'/>}
                <InteractionText>{likes}</InteractionText>
                <InteractionText  onPress={()=>navigation.navigate('LikesScreen', {postId:item.id})}>Likes</InteractionText>
            </Interaction>
            <Interaction>
                <Ionicons name="md-chatbubble-outline" size={25}/>
                <InteractionText onPress={onPress2}>comments</InteractionText>
            </Interaction>
        </InteractionWrapper>
    </Card>
    );

};

export default PostCard;

