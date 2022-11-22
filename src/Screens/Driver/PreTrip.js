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
import { TRIPS_EP, GATEWAY_URL, INITIALIZE_TRIP } from "../../Constants";
import axios from "axios";
import { useState, useEffect } from "react";
import {tryChangeTripState} from '../Utils'

function tryGetTripInfo(trip_id) {
  return axios.get(GATEWAY_URL + TRIPS_EP + trip_id);
}

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
        My current address is {userAddress.street}, {userAddress.streetNumber}
      </Text>

      <Text style={{ color: "#fff", fontSize: 24 }}>
        My passenger is at {srcStreet}, {srcStreetNumber}
      </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "yellow", padding: 20 }]}
          onPress={async () => {
            try{
              let userToken = await token.value()
              let response = await tryChangeTripState(userToken,trip_id, INITIALIZE_TRIP)
              navigation.navigate("DriverTrip",  {data: {passenger: passenger, trip_id: trip_id} });
            }
            catch(e){
              //For later: error code for this is 400
              console.log(e)
              Alert.alert("Can't start trip", "Please get close to the passenger and pick them up!")
            }
          }}
        >
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableOpacity>

    </View>
  );
}
