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
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { mapContext } from "../../MapContext";
import { getUserStatus, getUserToken } from "../../UserContext";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
import { TRIPS_EP, GATEWAY_URL } from "../../Constants";
import axios from "axios";
function tryGetTripInfo(trip_id) {
  return axios.get(GATEWAY_URL + TRIPS_EP + trip_id);
}
import { useState, useEffect } from "react";

export default function PreTrip({ route }) {
  const [srcStreet, setSrcStreet] = useState("");
  const [srcStreetNumber, setSrcStreetNumber] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let response = await tryGetTripInfo(trip_id);
        let {src_address, src_number} = response.data
        setSrcStreet(src_address)
        setSrcStreetNumber(src_number)
      } catch (e) {
        console.log(e);
      }
    })();
  },[]);
  //FIXME: what happens if get to passenger address fails?
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
      <Text style={{ color: "#fff", fontSize: 24 }}>Welcome to pre trip</Text>
      <Text style={{ color: "#fff", fontSize: 24 }}>
        My current coordinates are {userLocation.latitude},{" "}
        {userLocation.longitude}
      </Text>
      <Text style={{ color: "#fff", fontSize: 24 }}>
        My current address is {userAddress.street}, {userAddress.streetNumber}
      </Text>

      <Text style={{ color: "#fff", fontSize: 24 }}>
        My passenger is at {srcStreet}, {srcStreetNumber}
      </Text>

    </View>
  );
}
