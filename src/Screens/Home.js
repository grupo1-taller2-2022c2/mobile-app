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
import { API_GATEWAY_PORT, DRIVER_ME_EP, ME_EP, SESSION_EXPIRED_MSG, GENERIC_ERROR_MSG, GATEWAY_URL } from "../Constants";
import {updateDriverStatus} from "./Utils";


function tryGetMyProfile(token) {
  return axios.get(GATEWAY_URL + ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

function checkIfIAmDriver(token) {
  return axios.get(GATEWAY_URL + DRIVER_ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function Home({ navigation }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  updateDriverStatus(token, userStatus);
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
              console.log("Token not found");
              Alert.alert("Something went wrong!");
              userStatus.signInState.signOut();
            })
            .then((token) => {
              return tryGetMyProfile(token);
            })
            .then((response) => {
              navigation.navigate("MyProfile", { data: response.data });
            })
            .catch((e) => {
              console.log(e);
              //FIXME: is this truly the only error case?
              Alert.alert(SESSION_EXPIRED_MSG);
              userStatus.signInState.signOut();
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

      {userStatus.registeredAsDriver.value ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            userStatus.driverMode.enter();
          }}
        >
          <Text style={styles.buttonText}>Switch to Driver mode</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("DriverRegistration");
          }}
        >
          <Text style={styles.buttonText}>Register as a Driver!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
