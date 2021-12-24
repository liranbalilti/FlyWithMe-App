import React,{useState,useEffect} from 'react';
import {FlatList} from 'react-native';

import {Container,} from '../styles/FeedStyles';
import PostCard from '../components/PostCard';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';

const Posts = [
    {
        id: '1',
        userName: 'Liran Balilti',
        userImg: require('../assets/users/user-1.jpg'),
        postTime: '4 mins ago',
        postImg: require('../assets/posts/post-img-1.jpg'),
        liked: true,
        likes: '14',
        comments: '5'
    },
]

const HomeScreen = ({navigation}) => {

    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const fetchPosts = async () => {
      try {
        const list = [];
  
        await firestore()
          .collection('posts')
          .orderBy('postTime', 'desc')
          .get()
          .then((querySnapshot) => {
            // console.log('Total Posts: ', querySnapshot.size);
  
            querySnapshot.forEach((doc) => {
              const {
                userId,
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
                post,
                postImg,
                liked: false,
                likes,
                comments,
              });
            });
          });
  
        setPosts(list);
        if (loading) {
          setLoading(false);
        }
  
        console.log('Posts: ', posts);
      } catch (e) {
        console.log(e);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);

    return (
            <FlatList
                data={posts}
                renderItem={({item}) => ( <PostCard item={item} onPress={()=> navigation.navigate('HomeProfile',{userId: item.userId})}/> )}
                keyExtractor={item=>item.id}
                showsVerticalScrollIndicator={false}
            />
    );
}

export default HomeScreen;
