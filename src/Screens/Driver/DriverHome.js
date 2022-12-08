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
import { getUserStatus, getUserToken } from "../../UserContext";
import { API_GATEWAY_PORT, DRIVER_ME_EP, HTTP_STATUS_UNAUTHORIZED,HTTP_STATUS_DOESNT_EXIST, SESSION_EXPIRED_MSG, GENERIC_ERROR_MSG, GATEWAY_URL } from "../../Constants";

function tryGetMyProfile(token) {
  return axios.get(GATEWAY_URL + DRIVER_ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function DriverHome({ navigation }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
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
              navigation.navigate("DriverMyProfile", { data: response.data });
            })
            .catch((e) => {
              const status_code = e.response.status;
              console.log(e);
              if (status_code == HTTP_STATUS_DOESNT_EXIST) 
              //FIXME: Maybe unreachable
              {Alert.alert("You are not registered as a driver");}
              else if (status_code == HTTP_STATUS_UNAUTHORIZED)  {
                Alert.alert(SESSION_EXPIRED_MSG);
                userStatus.signInState.signOut();
              }
              else {
                Alert.alert(GENERIC_ERROR_MSG);
                userStatus.signInState.signOut();
              }
            });
        }}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>
        <TouchableOpacity // Esto es horrible. Despues le metemos un useState con el profile o algo asi
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
                        navigation.navigate("WalletDriver", { data: response.data });
                    })
                    .catch((e) => {
                        console.log(e);
                        //FIXME: is this truly the only error case?
                        Alert.alert(SESSION_EXPIRED_MSG);
                        userStatus.signInState.signOut();
                    });
            }}
        >
            <Text style={styles.buttonText}>See or Withdraw funds</Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("WaitingForTrip");
        }}
      >
        <Text style={styles.buttonText}>Start Driving!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          userStatus.driverMode.exit()
        }}
      >
        <Text style={styles.buttonText}>Switch to Passenger mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor:"yellow"}]}
        onPress={() => {
          navigation.navigate("DriverRating", {data: {passenger: {username: "John", surname: "Doe", ratings: 4.5}, trip_id: 1}});
        }}
      >
        <Text style={styles.buttonText}>Check out Rating Screen (dev)</Text>
      </TouchableOpacity>
    </View>
  );
}
