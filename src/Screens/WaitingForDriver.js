import loadingGif from "../../assets/loading-gif.gif";
import { styles } from "../Styles";
import { mapContext, MapContextProvider } from "./MapContext";
import { GENERIC_ERROR_MSG } from "../Constants";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import { API_GATEWAY_PORT, TRIPS_EP, HTTP_STATUS_OK } from "../Constants";
import Constants from "expo-constants";

import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT;

function tryGetTripState(token, tripID) {
  console.log("Get to " + apiUrl + TRIPS_EP + tripID);
  return axios.get(apiUrl + TRIPS_EP + tripID, {
    headers: { Authorization: "Bearer " + token },
    /*params: {
      trip_id: tripID,
    },*/
  });
}

export default function WaitingForDriver({ route }) {
  const userStatus = getUserStatus();
  const token = getUserToken();

  const [driverAcceptedTrip, setDriverAcceptedTrip] = useState(false);

  let data = route.params;
  let driver = data.assignedDriver;
  let tripID = data.tripID;

  async function isTripAccepted(tripID) {
    try {
      let userToken = await token.value();
      const response = await tryGetTripState(userToken, tripID);
      if (response.status === HTTP_STATUS_OK) {
        if (response.data.state === "Accepted") {
          setDriverAcceptedTrip(true);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", GENERIC_ERROR_MSG);
      userStatus.signInState.signOut();
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Asking if trip was accepted...");
      isTripAccepted(tripID);
    }, 4000);

    return () => clearInterval(interval)
  });

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Image
        source={loadingGif}
        style={{ height: 200, width: 200, resizeMode: "contain" }}
      />
      {driverAcceptedTrip ? (
        <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
          Driver is on the way!{"\n"}You will be notified at their arrival
        </Text>
      ) : (
        <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
          Waiting for Driver response
        </Text>
      )}
      <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
        {driver.username} {driver.surname} is your assigned Driver
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
        And they are driving a {driver.model}, with license plate{" "}
        {driver.licence_plate}
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
        Rating for this driver is: {driver.ratings}/5
      </Text>
    </View>
  );
}
