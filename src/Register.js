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

function verify_password(password, pass_repeat) {
  return password === pass_repeat;
}
function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!");
}
const localhost = "http://192.168.100.13:3001/users/signup";

function trySignUp(email, password, name, surname, setIsSignedUp) {
  return axios
    .post(localhost, {
      email: email,
      password: password,
      username: name,
      surname: surname,
    })
    .then((response) => {
      result = response.status === 200 ?? false;
      setIsSignedUp(result);
    })
    .catch((error) => {
      setIsSignedUp(false);
    });
}
export default function Register(props) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [pass_repeat, onChangePassRepeat] = useState("");
  const [name, onChangeName] = useState("");
  const [surname, onChangeSurname] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  return (
    <View>
      <Text style={[styles.title, { fontSize: 15 }]}>
        Please, enter an email address and a password
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Enter Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Enter Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassRepeat}
        value={pass_repeat}
        placeholder="Repeat Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Enter Name"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeSurname}
        value={surname}
        placeholder="Enter Surname"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "dodgerblue" }]}
        onPress={() => {
          trySignUp(email, password, name, surname, setIsSignedUp).then(() => {
            if (isSignedUp) {
              setIsSignedUp(false);
              props.navigation.navigate("Login");
            } else {
              alertWrongCredentials();
            }
          });
        }}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
