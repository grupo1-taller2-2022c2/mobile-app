import React, { useState } from "react";
import { styles } from "./Styles";
import axios from "axios";

import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";

const localhost = "http://localhost:3001";

function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!");
}

function trySignIn(email, password) {
  var result;
  axios
    .post(localhost + "/token", {
      params: {
        username: email,
        password: password,
      },
    })
    .then((response) => {
      console.log(response);
      result = true;
    })
    .catch((error) => {
      console.log(error);
      result = false;
    });
  return result;
}

export default function Login(props) {
  const [email, onChangeEmail] = useState(null);
  const [password, onChangePassword] = useState(null);

  return (
    <View>
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
        onPress={() =>
          trySignIn(email, password)
            ? props.navigation.navigate("Home")
            : alertWrongCredentials()
        }
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "dodgerblue" }]}
        onPress={() => props.navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
