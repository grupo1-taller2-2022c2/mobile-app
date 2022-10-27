import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { styles } from "../Styles";
import { getUserStatus, getUserToken } from "../UserContext";
import { API_GATEWAY_PORT, DRIVER_ME_EP, ME_EP } from "../Constants";
import Constants from "expo-constants";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + ME_EP;

function tryGetMyProfile(token) {
  return axios.get(apiUrl, {
    headers: { Authorization: "Bearer " + token },
  });
}

const driverUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + DRIVER_ME_EP;
function checkIfIAmDriver(token) {
  return axios.get(driverUrl, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function Home({ navigation }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  return (
    <View style={styles.container}>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          userStatus.signInState.signOut();
        }}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          token
            .value()
            .catch((e) => {
              console.log("Session Expired");
              Alert.alert("Session Expired");
              //FIXME: Add session expired code
            })
            .then((token) => {
              return tryGetMyProfile(token);
            })
            .then((response) => {
              navigation.navigate("MyProfile", { data: response.data });
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Map");
        }}
      >
        <Text style={styles.buttonText}>Go to Map!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          token
            .value()
            .catch((e) => {
              console.log("Session Expired");
              Alert.alert("Session Expired");
              //FIXME: Add session expired code
            })
            .then((token) => {
              console.log("into then and token is " + token);
              return checkIfIAmDriver(token);
            })
            .then((response) => {
              userStatus.driverMode.enter()
              //FIXME: let api know there is a new available driver
            })
            .catch((e) => {
              console.log(e);
              Alert.alert("You are not registered as a driver!");
            });
        }}
      >
        <Text style={styles.buttonText}>Switch to Driver mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("DriverRegistration");
        }}
      >
        <Text style={styles.buttonText}>Register as a Driver</Text>
      </TouchableOpacity>
    </View>
  );
}
