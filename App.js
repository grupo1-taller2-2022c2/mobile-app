import React, {useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./src/Login";
import {styles} from "./src/Styles"

import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button
} from "react-native";

export default function App() {
  return <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
</NavigationContainer>
}

const Stack = createNativeStackNavigator();
const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
    <Login navigation={navigation}/>
    </View>

  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <Text>You have succesfully logged in!</Text>
  );
};