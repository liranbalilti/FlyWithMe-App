import React,{useContext,useEffect,useState} from 'react';
import {View,Text,StyleSheet,FlatList,SafeAreaView,StatusBar,Button} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import {FlightCommunity} from '../screens/FlightCommunity';

const FlightsScreen = ({navigation}) => {

    const {user} = useContext(AuthContext);
    const [flights,setFlights] = useState(null);

    useFocusEffect( 
        React.useCallback(() => {
        const fetchFlights = async() => {
            try {
                const list = [];
                await firestore()
                .collection('flights')
                .where("userId","==",user.uid)
                .get()
                .then((querySnapShot) => {
                    querySnapShot.forEach(doc => {
                        const {destination,startDate,endDate} = doc.data();
                        list.push({
                            id: doc.id,
                            destination: destination,
                            startDate,
                            endDate
                        });
                    })
                    
                })
                setFlights(list);
            } catch(e) {
                console.log(e);
            }
        }
        fetchFlights();
    },[]));


    return (
        <SafeAreaView style={styles.container}>
        <FlatList
          data={flights}
          renderItem={({item}) => 
          
            <View style={styles.title} >
                <Button  
                    onPress={ () => {

                        navigation.navigate('FlightNav',{
                            
                            destination: item.destination, 
                            
                            startDate: item.startDate,
                            endDate: item.endDate,

                        });
                }} 
                    title={ item.destination+"   "+item.startDate+"-"+item.endDate}
                /> 
            </View>
        }
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
}

export default FlightsScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#f9c2f0',
      padding: 20,
      marginTop: 2,
      marginBottom: 2,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    buttonStyle: {
        backgroundColor: '#000000',
    },
    title: {
      fontSize: 32,
      marginTop: 2,
      borderRadius: 25,
      borderColor: '#000000'
    },
  });