import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

const tab = createBottomTabNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <tab.Navigator>
            <tab.Screen name="Projet" component={Projet} />
            <tab.Screen name="Parcelle" component={Parcelle} />
            <tab.Screen name="Adresse" component={Adresse} />
            <tab.Screen name="Emplacement" component={Emplacement} />
            <tab.Screen name="Segment" component={Segment} />
            <tab.Screen name="Compartiment" component={Compartiment} />
        </tab.Navigator>
      </NavigationContainer>

  );
}



export default App;
