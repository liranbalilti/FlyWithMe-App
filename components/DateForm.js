import React,{useState} from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";


const DateForm = ({onSet,onDet}) => {

    const [displayedDate,setDisplayedDate] = useState(moment());
    const [startDate,setStartDate] = useState(null);
    const [endDate,setEndDate] = useState(null);

    const setDates = (dates) => {
        setStartDate(dates.startDate);
        setEndDate(dates.endDate);
        onSet(dates.startDate);
        setDisplayedDate(moment());
        console.log(dates.startDate);
        console.log(dates.endDate);
    }
    
    return (
        <View style={styles.container}>
        <DateRangePicker
          onChange={(dates) => setDates(dates)}
          startDate={startDate}
          endDate={endDate}
          displayedDate={displayedDate}
          range
        >
          <Text>Click me!</Text>
        </DateRangePicker>
        </View>
    );
}

export default DateForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});