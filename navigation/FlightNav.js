import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FlightCommunity from '../screens/FlightCommunity';
import FlightFeed from '../screens/FlightFeed';
import FlightsScreen from '../screens/FlightsScreen';


const Tab = createMaterialTopTabNavigator();

const FlightNav = ({route,navigation}) => {

  const {destination,startDate,endDate} = route.params;
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Community" 
        component={FlightCommunity} 
        initialParams={{destination: destination,
        startDate:startDate,endDate:endDate}} 
      />
      <Tab.Screen 
        name="Feed" 
        component={FlightFeed} 
        initialParams={{destination: destination,
        startDate:startDate,endDate:endDate}} 
      />
    </Tab.Navigator>
  );
}

export default FlightNav;