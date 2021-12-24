import React,{useContext,useEffect, useState} from 'react';
import {SafeAreaView,Text,StyleSheet,FlatList,TouchableOpacity,View,ScrollView} from 'react-native';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TouristCard from '../components/TouristCard';
import FlightsScreen from '../screens/FlightsScreen';

const Tab = createMaterialTopTabNavigator();

const FlightCommunity = ({ route, navigation }) => {


    const {user} = useContext(AuthContext);
    const {destination,startDate,endDate} = route.params;
    const [results,setResults] = useState([]);
    const [loading,setLoading] = useState(true);
    const list = [];    

    const filterByDates = (results,startDate,endDate) => {
        return results.filter(res => {
            return startDate<res.endDate && res.startDate<endDate;
        });
    };

    useEffect(() => {
        const fetchCommunity = async() => {
            try {
                 
                //const list = [];
                await firestore()
                .collection('flights')
                .where("destination","==",destination)
                .where("userId","!=",user.uid)
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach(doc => {
                        const {userId,flightDesc,startDate,endDate} = doc.data();
                        list.push({
                            id: doc.id,
                            userId,
                            startDate,
                            endDate,
                            flightDesc
                        });
                    })
                })  
                setResults(filterByDates(list,startDate,endDate));
                setLoading(false);
            } catch(e) {
                setLoading(false);
                console.log(e);
            }
        }
        fetchCommunity();
    },[]);
    
    return (
        <SafeAreaView style={{flex: 1}}>
            {loading ? <View style={styles.myloader}><Text>Please wait...</Text></View> :
            <FlatList
                style={{flex:1}}
                data={results}
                keyExtractor={(item) => item.id} // Here was the error
                renderItem={({item}) => <TouristCard item={item} onPress={()=> navigation.navigate('HomeProfile', {userId: item.userId,postImg: item.postImg})} /> }
            /> }
        </SafeAreaView>
    );
}

export default FlightCommunity;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    },
    myloader: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: "#ffffff",
        opacity: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%"
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