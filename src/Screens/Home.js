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
import { userStatus, userToken } from "../UserContext";
import { API_GATEWAY_PORT, ME_EP, PASSENGERS_EP } from "../Constants";
import Constants from "expo-constants";

const localhost = Constants.manifest.extra.localhost;
const apiUrl =
  "http://" + localhost + ":" + API_GATEWAY_PORT + PASSENGERS_EP + ME_EP;

function tryGetMyProfile(token) {
  return axios.get(apiUrl, {
    headers: { Authorization: "Bearer " + token },
  });
}
export default function Home({ navigation }) {
  const userIsSignedIn = userStatus();
  const token = userToken();
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
          userIsSignedIn.set(false);
        }}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          tryGetMyProfile(token.value)
            .then((response) => {
              navigation.navigate("MyProfile", { data: response.data });
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
          navigation.navigate("Map");
        }}
      >
        <Text style={styles.buttonText}>Go to Map!</Text>
      </TouchableOpacity>
    </View>
  );
}
