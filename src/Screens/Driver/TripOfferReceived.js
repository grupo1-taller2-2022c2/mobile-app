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
  UPDATE_LOCATION_EP,
} from "../../Constants";
import Constants from "expo-constants";
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

export default function TripOfferReceived() {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const context = mapContext();
  const navigation = React.useContext(NavigationContext);

  //FIXME: should receive from context or route
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
            navigation.navigate("DriverHome");
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
            //navigation.navigate("TripOfferReceived");
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
            navigation.navigate("DriverHome");
            //FIXME should add setting self as unavailable in backend
          }}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
