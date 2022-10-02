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

function verify_password(password, pass_repeat) {
    return (password === pass_repeat);
}


export default function Register(props) {
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [pass_repeat, onChangePassRepeat] = useState("")
  
    return (
      <View>
        <Text style={[styles.title, {fontSize: 15}]}>Please, enter an email address and a password</Text>
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
        <TouchableOpacity
          style={[styles.button, {backgroundColor: "dodgerblue"}]}
          onPress={() => verify_password(password, pass_repeat)? Alert.alert('Valid Password!') : Alert.alert("Please enter a matching password")} 
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }