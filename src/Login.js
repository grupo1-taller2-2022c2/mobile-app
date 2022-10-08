import React, { useState } from "react";
import { styles } from "./Styles";
import axios from "axios";
import qs from "qs";
import Constants from 'expo-constants';
import { API_GATEWAY_PORT, SIGNIN_EP } from "./Constants";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { userStatus, userStatusUpdate } from "./UserContext";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + SIGNIN_EP;


function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!");
}

function trySignIn(email, password) {
  return axios
    .post(
      apiUrl,
      qs.stringify({
        username: email,
        password: password,
      })
    )
}

export default function Login({navigation}) {
  const [email, onChangeEmail] = useState(null);
  const [password, onChangePassword] = useState(null);

  const setSignInStatus = userStatusUpdate();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FI-UBER</Text>
      <Text style={styles.text}>
        Please enter your email address and password
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          trySignIn(email, password)
              .then((response) => {
                  let token = response.data["access_token"];
                  console.log(token);
                  setSignInStatus(true);
                })
              .catch((e) => {
                  alertWrongCredentials();
              });
        }}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "dodgerblue" }]}
        onPress={() => {navigation.navigate("Register")}}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("MyProfile")
        }}
      >
        <Text style={styles.buttonText}>Profile Screen (dev)</Text>
      </TouchableOpacity>
    </View>
  );
}
