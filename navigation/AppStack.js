import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import addFlightScreen from '../screens/addFlightScreen';
import FlightsScreen from '../screens/FlightsScreen';
import FlightCommunity from '../screens/FlightCommunity';
import profileScreen from '../screens/ProfileScreen';
import editProfileScreen from '../screens/editProfileScreen';
import createPostScreen from '../screens/createPostScreen';
import FlightNav from './FlightNav';
import CommentScreen from '../screens/CommentScreen';
import PostCard from '../components/PostCard';
import LikesScreen from '../screens/LikesScreen';
import MessagesScreen from '../screens/MessagesScreen';
import friendButton from '../components/friendButton';
import friendRequests from '../screens/friendRequests';
import ChatScreen from '../screens/ChatScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
  
  <Stack.Navigator>
    <Stack.Screen
      name="Flights"
      component={FlightsScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize:18
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.navigate('addFlight')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
          name="addFlight"
          component={addFlightScreen}
          options={({navigation}) => ({
            title: '',
            headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate('Flights')}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
          name="Community"
          component={FlightCommunity}
          options={({navigation}) => ({
            title: '',
            headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate('Flights')}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
          name="HomeProfile"
          component={profileScreen}
          options={({navigation}) => ({
            title: '',
            headerStyle: {
            backgroundColor: '#fff',
            shadowColor: '#fff',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <FontAwesome.Button 
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate('Flights')}
              />
            </View>
          ),
        })}
      />
    <Stack.Screen
      name="addPost"
      component={createPostScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize:18
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.goBack()}
            />
          </View>
        ),
      }}
    />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="editProfile" component={editProfileScreen} />
      <Stack.Screen name="FlightNav" component={FlightNav} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="PostCard" component={PostCard} />
      <Stack.Screen name="LikesScreen" component={LikesScreen} />
      <Stack.Screen name="friendButton" component={friendButton} />
      <Stack.Screen name="friendRequests" component={friendRequests} />
  </Stack.Navigator>
);
const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({route}) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

const AppStack = () => {

  const getTabBarVisibility = (route) => {

    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (routeName === 'Chat') {
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#2e64e5',
      }}>
      <Tab.Screen
        name="Flights"
        component={FeedStack}
        options={{
          tabBarLabel: 'Flights',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="airplane-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          //tabBarVisible: getTabBarVisibility(route),
          // Or Hide tabbar when push!
          // https://github.com/react-navigation/react-navigation/issues/7677
          // tabBarVisible: route.state && route.state.index === 0,
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={profileScreen}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppStack;