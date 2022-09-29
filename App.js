import React, {useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

function alertData(email, password) {
  Alert.alert("Email: " + email + "\n" + "Password: " + password);
}

export default function App() {
  const [email, onChangeEmail] = useState(null);
  const [password, onChangePassword] = useState(null);

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
        onPress={() => alertData(email, password)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  title: {
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 30,
  },
  text: { color: "white", textAlign: "center", marginBottom: 15, fontSize: 13 },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    marginTop: 7,
    marginBottom: 7,
    backgroundColor: "lightgray",
    borderRadius: 8,
  },
  button: {
    justifyContent: "space-around",
    backgroundColor: "lightskyblue",
    padding: 10,
    marginTop: 10,
    borderColor: "dodgerblue",
    borderRadius: 8,
    alignItems: "center",
    margin: 12,
  },
  buttonText: {
    fontSize: 15,
  }
});
