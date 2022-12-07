import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import qs from "qs";
import { API_GATEWAY_PORT, SIGNIN_EP, GATEWAY_URL, GOOGLE_SIGNUP_IF_NEW_EP } from "../Constants";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { getUserStatus, getUserToken } from "../UserContext";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

function alertWrongCredentials() {
  Alert.alert("Wrong Credentials!");
}

WebBrowser.maybeCompleteAuthSession();

function trySignIn(email, password) {
  return axios.post(
    GATEWAY_URL + SIGNIN_EP,
    qs.stringify({
      username: email,
      password: password,
    })
  );
}

function tryGoogleSignUpIfNew(access_token) {
  return axios.post(
    GATEWAY_URL + GOOGLE_SIGNUP_IF_NEW_EP, {
			headers: {
				Authorization: 'Bearer ' + access_token,
			},
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    });
}


export default function Login({ navigation }) {
  const [email, onChangeEmail] = useState(null);
  const [password, onChangePassword] = useState(null);

  const userStatus = getUserStatus();
  const token = getUserToken();

  // For login with feredated identity provider
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      expoClientId: "82078037515-an42c8jkkm2c9gdp5s6gjgta54s2paql.apps.googleusercontent.com",
      androidClientId:"82078037515-rqu7r5e6ki8ocor99ikp8rq9oin3spgt.apps.googleusercontent.com",
      iosClientId:"82078037515-3fjl0cd7mqa3njb7t2of1d2ev3uc8mou.apps.googleusercontent.com"
    },
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(res => {
          res.user.getIdTokenResult().then(
            id_toke_res => {
              tryGoogleSignUpIfNew(id_toke_res.token)
            }
          )
        }
        )
        .catch(error => {
          console.log("firebase cred err:", error);
        });
    }
  }, [response]);

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
        style={styles.button}
        onPress={() => {
            promptAsync() // trySignInWithGoogle() 
            .then((response) => {
              console.log("Got response at Sign In with Google!")
              // let token_data = response.data["access_token"];
              // token.set(token_data);
              // userStatus.signInState.signIn();
            })
            .catch((e) => {
              console.log("Did not get response at Sign In with Google")
              alertWrongCredentials();
            });
        }}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
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
