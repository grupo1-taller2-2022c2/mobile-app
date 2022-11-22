import axios from "axios";
import {
  Alert,
} from "react-native";
import { API_GATEWAY_PORT, DRIVER_ME_EP, GATEWAY_URL, TRIPS_EP,UPDATE_LOCATION_EP } from "../Constants";

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

export function tryChangeTripState(token, trip_id, new_state) {
  console.log("New state for trip : " + trip_id +" is " + new_state);
  return axios.patch(
    GATEWAY_URL + TRIPS_EP,
    {
      trip_id: trip_id,
      action: new_state,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function tryDeleteDriverLastLocation(token) {
  return axios.delete(
    GATEWAY_URL + UPDATE_LOCATION_EP +"/",
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}