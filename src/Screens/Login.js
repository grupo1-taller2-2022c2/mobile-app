import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import qs from "qs";
import {API_GATEWAY_PORT, SIGNIN_EP, GATEWAY_URL, GOOGLE_SIGNUP_IF_NEW_EP, NOTIF_TOKEN_EP} from "../Constants";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Platform,
} from "react-native";
import { getUserStatus, getUserToken } from "../UserContext";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Notifications from "expo-notifications";

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
  console.log(access_token)
  axios.post(
    GATEWAY_URL + GOOGLE_SIGNUP_IF_NEW_EP, {}, {
			headers: {
				'token': access_token,
			},
    })
    .then((res) => {
      // El usuario se registró porque era nuevo. No hacer nada, supongo
      console.log("The user was new to the app and was registered")
    })
    .catch((err) => {
      if (err.response.status === 409){
        console.log(err.response.data)
      } else {
        console.log("An error occurred while trying to register user that logged in with Google: " + err.response.data)
      }
    });
}

function trySendNotificationsToken(userToken, expoToken) {
    return axios.post(
        GATEWAY_URL + NOTIF_TOKEN_EP,
        {
            token: expoToken,
        },
        { headers: { Authorization: "Bearer " + userToken } }
    );
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
  const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }
      if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
      }
      const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("NOTIFICATION TOKEN: ", expoToken);
      console.log("TYPE OF: ", typeof expoToken);

      if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
          });
      }

      return expoToken;
  };

    React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(res => {
          res.user.getIdTokenResult().then(
            id_toke_res => {
              token.set(id_toke_res.token)
              tryGoogleSignUpIfNew(id_toke_res.token)
            }
          )
        }
        )
        .catch(error => {
          console.log("firebase credentials error:", error);
        });
        userStatus.signInState.signIn();
        console.log("Logged in!")
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
              registerForPushNotificationsAsync().then( (notificationToken) => {
                  console.log(`Notification token: ${notificationToken}`)
                  if (notificationToken) {
                      trySendNotificationsToken(token_data, notificationToken).catch(
                          (e) => Alert.alert("Failed to upload token for notifications.")
                      )
                  }
              }).catch(
                  (e) => {
                      console.log(e);
                      Alert.alert("Failed to get token for notifications.")}
              )
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
            promptAsync() 
            .then((response) => {
              console.log("Got response at Sign In with Google!")
              // Ya seteamos el token en el useEffect y logueamos si todo es exitoso
            })
            .catch((e) => {
              console.log("Could not Sign In with Google")
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
