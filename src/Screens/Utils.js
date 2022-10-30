import axios from "axios";
import {
  Alert,
} from "react-native";
import { API_GATEWAY_HOST, API_GATEWAY_PORT, DRIVER_ME_EP } from "../Constants";

const driverUrl = "http://" + API_GATEWAY_HOST + ":" + API_GATEWAY_PORT + DRIVER_ME_EP;
function checkIfIAmDriver(token) {
  return axios.get(driverUrl, {
    headers: { Authorization: "Bearer " + token },
  });
}

export function updateDriverStatus(token, userStatus) {
  token
    .value()
    .catch((e) => {
      console.log("Token not found");
      Alert.alert("Something went wrong!");
      userStatus.signInState.signOut();
    })
    .then((token) => {
      return checkIfIAmDriver(token);
    })
    .then((response) => {
        userStatus.registeredAsDriver.setIsRegistered();
    })
    .catch((e) => {
        userStatus.registeredAsDriver.setIsNotRegistered();
    });
}
