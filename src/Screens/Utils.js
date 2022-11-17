import axios from "axios";
import {
  Alert,
} from "react-native";
import { API_GATEWAY_PORT, DRIVER_ME_EP, GATEWAY_URL } from "../Constants";

function checkIfIAmDriver(token) {
  return axios.get(GATEWAY_URL + DRIVER_ME_EP, {
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
