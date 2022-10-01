import React, {useState} from "react";
import {styles} from "./Styles"

import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button
} from "react-native";

function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!")
}

function verifySignUp(email, password){
  return (email === "email" && password === "123")
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
        <Text style={styles.text}>
          (Email: "email", Password: "123")
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
          onPress={() => verifySignUp(email,password)? props.navigation.navigate('Home') : alertWrongCredentials()}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: "dodgerblue"}]}
          onPress={() => Alert.alert("Register button")}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }