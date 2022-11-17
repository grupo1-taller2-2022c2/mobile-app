import loadingGif from "../../../assets/loading-gif.gif";
import { styles } from "../../Styles";
import { mapContext, MapContextProvider } from "../../MapContext";
import { GENERIC_ERROR_MSG } from "../../Constants";
import { getUserStatus, getUserToken } from "../../UserContext";
import axios from "axios";
import {
  API_GATEWAY_PORT,
  TRIPS_EP,
  HTTP_STATUS_OK,
  GATEWAY_URL,
  UPDATE_LOCATION_EP,
} from "../../Constants";
import * as Location from "expo-location";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
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
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

function tryRejectTrip(token, trip_id) {
  return axios.patch(
    GATEWAY_URL + TRIPS_EP,
    {
      trip_id: trip_id,
      action: "Deny",
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export default function TripOfferReceived({route}) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const context = mapContext();
  const navigation = React.useContext(NavigationContext);

  const {data} = route.params
  //Fixme: to be done from backend
  //const passenger_profile = data.passenger_profile
  const trip_id = data
  //FIXME: should receive from context or route

  const handleTripRejection = async () => {

    try {
      const userToken = await token.value()
      const response = await tryRejectTrip(userToken, trip_id);
      if (response.status === HTTP_STATUS_OK) {
        navigation.navigate("DriverHome");
      } 
    } catch (error) {
      console.log(error)
      //FIXME shouldnt navigate anyway
      navigation.navigate("DriverHome");
      //Alert.alert(GENERIC_ERROR_MSG);
      //userStatus.signInState.signOut();
    }
  }
  const mock_profile = {
    username: "Pasajero",
    surname: "De mentira",
    ratings: 3,
  };
  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
        Trip Offer Received!
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 25 }]}>
        Passenger details:
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
        Name: {mock_profile.username}
        {"\n"}Surname: {mock_profile.surname}
        {"\n"}Ratings:{mock_profile.ratings}/5
      </Text>

      <View style={{ justifyContent: "center", flexDirection: "row", marginTop: 30 }}>
        <CountdownCircleTimer
          isPlaying
          duration={10}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          trailColor = "#3380FF"
          size={240}
          onComplete={() => {
            handleTripRejection()
          }}
        >
          {({ remainingTime }) => (
            <Text style={[styles.text, { fontSize: 22 }]}>
              Auto-reject in {remainingTime} seconds
            </Text>
          )}
        </CountdownCircleTimer>
      </View>
      <View
        style={{
          backgroundColor: "#000",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 30
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "dodgerblue", class: "inline", flex: 1 },
          ]}
          onPress={() => {
            navigation.navigate("PreTrip");
          }}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "dodgerblue", class: "inline", flex: 1 },
          ]}
          onPress={() => {
            handleTripRejection()
          }}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
