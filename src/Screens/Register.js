import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { GATEWAY_URL, SIGNUP_EP, USER_ALREADY_EXISTS } from "../Constants";


function verify_password(password, pass_repeat) {
  return password === pass_repeat;
}
function alertWrongCredentials() {
  Alert.alert("Please enter valid credentials!");
}
function alertUserAlreadyExists() {
  Alert.alert("An existing account is using this email!");
}

function trySignUp(email, password, name, surname) {
  return axios.post(GATEWAY_URL + SIGNUP_EP, {
    email: email,
    password: password,
    username: name,
    surname: surname,
  });
}
export default function Register(props) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [pass_repeat, onChangePassRepeat] = useState("");
  const [name, onChangeName] = useState("");
  const [surname, onChangeSurname] = useState("");

  return (
    <View style={styles.container}>
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
        onPress={async () => {
          try {
            let response = await trySignUp(email, password, name, surname)
            Alert.alert("Successful Sign Up!");
            props.navigation.navigate("Login");
          }
          catch(e) {
            console.log(e)
            if (e.response && e.response.status === USER_ALREADY_EXISTS) {
              console.log(e.response.data.detail)
              alertUserAlreadyExists();
            }
            else{
              alertWrongCredentials();
            }
          }
          
        }}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
