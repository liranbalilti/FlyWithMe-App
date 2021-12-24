import React,{useState,useContext} from 'react';
import FormCity from '../components/FormCity';
import {View, StyleSheet,Text} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import DatePicker from 'react-native-date-picker';

const addFlightScreen = ({navigation}) => {

    const [destination,setDest] = useState("");
    const [startDate,setStartDate] = useState(new Date());
    const [endDate,setEndDate] = useState(new Date());
    const [desc,setDesc] = useState(null);
    const {user} = useContext(AuthContext);

    var day = ('0' + startDate.getDate()).slice(-2);
    var month = ('0' + (startDate.getMonth() + 1)).slice(-2);
    var year = startDate.getFullYear();
    var day2 = ('0' + endDate.getDate()).slice(-2);
    var month2 = ('0' + (endDate.getMonth() + 1)).slice(-2);
    var year2 = endDate.getFullYear();
  
    var startRes = day + '/' + month + '/' + year;
    var endRes = day2 + '/' + month2 + '/' + year2;
    console.log(startRes);
    console.log(endRes);

    const submitPost = () => {
        firestore()
        .collection('flights')
        .add({
            userId: user.uid,
            destination,
            startDate: startRes,
            endDate: endRes,
        })
        .then(() => {
            alert('Flight Added Successfully!');
            //console.log(date.toISOString().split('T')[0]);
        })
        .catch((err) => {
            console.log('Something went wrong with adding flight to firebase ',err);
        });
    };



  return (
    <View style={styles.container}>
        <FormCity onDest={setDest} />
        <FormInput
              labelValue={desc}
              onChangeText={(desc) => setDesc(desc)}
              placeholderText="Enter flight description.."
              autoCapitalize="none"
              autoCorrect={false}
            />
        <DatePicker style={styles.buttonContainer}
            date={startDate}
            onDateChange={setStartDate}
            mode="date"
        />
        <DatePicker style={styles.buttonContainer}
            date={endDate}
            onDateChange={setEndDate}
            mode="date"
        />
        <FormButton
            buttonTitle="+ Add Flight"
            onPress={ () => {
                submitPost(); 
                setDest("");
                navigation.navigate('Flights');
            }}
        />
    </View>
        
  );
};

export default addFlightScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    buttonContainer: {
        width: 500,
      },
  });



