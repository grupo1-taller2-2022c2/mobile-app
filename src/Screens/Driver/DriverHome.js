import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { styles } from "../../Styles";
import { userStatus, userToken } from "../../UserContext";
import { API_GATEWAY_PORT, DRIVER_ME_EP } from "../../Constants";
import Constants from "expo-constants";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + DRIVER_ME_EP;

function tryGetMyProfile(token) {
  return axios.get(apiUrl, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function DriverHome({ navigation }) {
  const userIsSignedIn = userStatus();
  const token = userToken();
  return (
    <View style={styles.container}>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in as a Driver! {"\n"}
        We will let you know when a passenger requests a ride!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          userIsSignedIn.set(false);
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
              navigation.navigate("DriverMyProfile", { data: response.data });
            })
            .catch((e) => {
              console.log(e);
              console.log(apiUrl);
            });
        }}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Text style={styles.buttonText}>Switch to Passenger mode</Text>
      </TouchableOpacity>
    </View>
  );
}