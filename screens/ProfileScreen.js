import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';
import friendButton from '../components/friendButton';
import { set } from 'react-native-reanimated';

const ProfileScreen = ({navigation, route}) => {

    const {user,logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequestCheck,setFriendRequest] = useState(false);


    const fetchPosts = async () => {
      try {
        const list = [];
  
        await firestore()
          .collection('posts')
          .where('userId', '==', route.params ? route.params.userId : user.uid)
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
  
        //console.log('Posts: ', posts);
      } catch (e) {
        console.log(e);
      }
    };
    const checkfriendRequest = async() => {
      console.log(user.uid);
      console.log(route.params.userId);
      try {
      await firestore()
      .collection('friendRequests')
      .where("sender","==",user.uid)
      .where("receiver","==",route.params.userId)
      .get()
      .then((querySnapShot) => {
        if(querySnapShot.size > 0 )
          setFriendRequest(true);
      })  
      } catch(e) {
        console.log(e);
      }
    }
    const getUser = async() => {
        const currentUser = await firestore()
        .collection('users')
        .doc(route.params ? route.params.userId : user.uid)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        })
      }

    const friendRequest = async() => {
      console.log('helllo');
      await firestore()
      .collection('friendRequests')
      .add({
        receiver: route.params.userId,
        sender: user.uid,
        requestTime: firestore.Timestamp.fromDate(new Date()),
      })
        .then(() => {
            setFriendRequest(!friendRequestCheck);
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });
    }
    
    const deleteRequest = async() => {
      await firestore().collection('friendRequests')
      .where("sender","==",user.uid)
      .where("receiver","==",route.params.userId)
      .get()
      .then((querySnapShot) => {
          querySnapShot.docs[0].ref.delete();
          setFriendRequest(!friendRequestCheck);
      })
      .catch((err) => {
          console.log('Something went wrong with adding flight to firebase ',err);
      });
  }

    useEffect(() => {
      getUser();
      fetchPosts();
      if(route.params!=null) {
        checkfriendRequest();
      }
      navigation.addListener("focus", () => setLoading(!loading));
    }, [navigation, loading, friendRequestCheck]);

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center' }}
            >
            <Image 
                style={styles.userImg}
                source={{uri: userData ? userData.userImg : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
            />
            {route.params ? null :      <TouchableOpacity style={{marginLeft: 180}} onPress={() => navigation.navigate('friendRequests')}>
                  <FontAwesome5 name="user-friends" size={25} />
              </TouchableOpacity>
              }
            <Text style={styles.userName}>
                {userData ? userData.fname : 'Annonymous' } {userData ? userData.lname : '' }
            </Text>
            <Text style={styles.aboutUser}>{userData ? userData.about : '' }</Text>
            <View style={styles.userBtnWrapper}>
            { route.params ? (
              <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              {!friendRequestCheck ? 
                  <TouchableOpacity style={styles.userBtn} onPress={() => {friendRequest()}}>
                    <Text style={styles.userBtnTxt}>Send Friend Request</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.userBtn} onPress={() => {deleteRequest()}}>
                    <Text style={styles.userBtnTxt}>Cancel Friend Request</Text>
                  </TouchableOpacity>
              }
              </>
            ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('editProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => navigation.navigate('addPost')}>
                <Text style={styles.userBtnTxt}>add Post</Text>
              </TouchableOpacity>
            </>
          )}
            </View>
            <View style={styles.userInfoWrapper}>
                <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>{posts.length}</Text>
                    <Text style={styles.userInfoSubTitle}>Posts</Text>
                </View>
                <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>2</Text>
                    <Text style={styles.userInfoSubTitle}>Friends</Text>
                </View>
            </View>

           {posts.map((item) => (
                <PostCard key={item.id} item={item} onPress={()=>navigation.navigate('HomeProfile', {userId:item.userId})}/>
            ))} 
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});