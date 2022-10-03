import axios from 'axios';
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";

export default function Home(props) {
  return (
    <View>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in!
      </Text>
      <Button title='Logout' onPress={() => {props.setIsSignedIn(false)
      props.navigation.navigate("Login")}}></Button>
      
    </View>
  );
}

