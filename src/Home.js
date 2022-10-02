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

export default function Home() {
  var [Response, setResponse] = useState(null);
  const baseUrl = 'https://mobile-fiuber.free.beeceptor.com/axios';

  return (
    <View>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in!
      </Text>
      {Response === null ? <Text style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}>Press the button!</Text> : <Text style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}>Got response:{Response}</Text>}
      <Button title="Send Request" onPress={() => {
        axios.get(baseUrl).then((response) => {
            setResponse(response.data)})
      }}></Button>
      
    </View>
  );
}

