import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { styles } from "../../Styles";
import { mapContext } from "../../MapContext";
import { getUserStatus, getUserToken } from "../../UserContext";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
import { TRIPS_EP, GATEWAY_URL, FINALIZE_TRIP } from "../../Constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { tryChangeTripState } from "../Utils";

function tryGetTripInfo(trip_id) {
  return axios.get(GATEWAY_URL + TRIPS_EP + trip_id);
}

export default function DriverTrip({ route }) {
  const [dstStreet, setDstStreet] = useState("");
  const [dstStreetNumber, setDstStreetNumber] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let response = await tryGetTripInfo(trip_id);
        let { dst_address, dst_number } = response.data;
        setDstStreet(dst_address);
        setDstStreetNumber(dst_number);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);

  const { data } = route.params;
  const { passenger, trip_id } = data;

  let { userLocation, userAddress } = context.values;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24 }}>Trip is in Course!</Text>

      <Text style={{ color: "#fff", fontSize: 24 }}>
        My current address is {userAddress.street}, {userAddress.streetNumber}
      </Text>

      <Text style={{ color: "#fff", fontSize: 24 }}>
        My destination is at {dstStreet}, {dstStreetNumber}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "yellow", padding: 20 }]}
        onPress={async () => {
          try {
            let userToken = await token.value();
            let response = await tryChangeTripState(
              userToken,
              trip_id,
              FINALIZE_TRIP
            );
            navigation.navigate("DriverRating",  {data: {passenger: passenger, trip_id: trip_id} })
          } catch (e) {
            //For later: error code for this is 400
            console.log(e);
            Alert.alert(
              "Can't end trip",
              "Please get close to the destination and drop off the passenger!"
            );
          }
        }}
      >
        <Text style={styles.buttonText}>Finish Trip</Text>
      </TouchableOpacity>
    </View>
  );
}
