import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import qs from "qs";
import { API_GATEWAY_HOST, API_GATEWAY_PORT, SIGNIN_EP } from "../Constants";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { getUserStatus, getUserToken } from "../UserContext";

const apiUrl = "http://" + API_GATEWAY_HOST + ":" + API_GATEWAY_PORT + SIGNIN_EP;

function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!");
}

function trySignIn(email, password) {
  return axios.post(
    apiUrl,
    qs.stringify({
      username: email,
      password: password,
    })
  );
}

export default function Login({ navigation }) {
  const [email, onChangeEmail] = useState(null);
  const [password, onChangePassword] = useState(null);

  const userStatus = getUserStatus();
  const token = getUserToken();

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
              console.log("Got response at Sign In!")
              let token_data = response.data["access_token"];
              token.set(token_data);
              userStatus.signInState.signIn();
            })
            .catch((e) => {
              console.log("Did not get response at Sign In")
              alertWrongCredentials();
            });
        }}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "dodgerblue" }]}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "yellow" }]}
        onPress={() => {
          //FIXME: delete this
          onChangeEmail("m@gmail.com");
          onChangePassword("a");
        }}
      >
        <Text style={styles.buttonText}>Fast Fill-in(dev)</Text>
      </TouchableOpacity>
    </View>
  );
}
