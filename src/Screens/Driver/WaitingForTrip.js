import loadingGif from "../../../assets/loading-gif.gif";
import { styles } from "../../Styles";
import { mapContext, MapContextProvider } from "../../MapContext";
import { getUserStatus, getUserToken } from "../../UserContext";
import axios from "axios";
import {
  API_GATEWAY_PORT,
  TRIPS_EP,
  HTTP_STATUS_OK,
  UPDATE_LOCATION_EP,
  ASSIGNED_TRIP_EP,
  GENERIC_ERROR_MSG,
  GATEWAY_URL,
} from "../../Constants";
import * as Location from "expo-location";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
import { useFocusEffect } from '@react-navigation/native';

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

function trySendLocation(token, street_name, street_number) {
  //console.log("Post to " + GATEWAY_URL + UPDATE_LOCATION_EP);

  return axios.post(
    GATEWAY_URL + UPDATE_LOCATION_EP,
    {
      street_name: street_name,
      street_num: street_number,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

function tryCheckIfTripAssigned(token) {
  return axios.get(GATEWAY_URL + ASSIGNED_TRIP_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function WaitingForTrip({ route }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const context = mapContext();
  const navigation = React.useContext(NavigationContext);

  let { setUserLocation, setUserAddress } = context.setters;
  const [errorMsg, setErrorMsg] = useState(null);

  async function updateLocation() {
    try {
      console.log("Updating Location...");
      let location = await Location.getCurrentPositionAsync();
      setUserLocation(location);
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserAddress(addresses[0]);
      //console.log(addresses[0]);

      let { street, streetNumber } = addresses[0];
      await checkIfLocationSent(street, parseInt(streetNumber));
    } catch (e) {
      //FIXME: maybe should logout
      console.log(e);
    }
  }

  async function checkIfLocationSent(street, streetNumber) {
    try {
      let userToken = await token.value();
      await trySendLocation(userToken, street, streetNumber);
      //FIXME: maybe check error cases
    } catch (error) {
      console.log(error);
      Alert.alert("Error", GENERIC_ERROR_MSG);
      userStatus.signInState.signOut();
    }
  }

  useEffect(() => {
    //console.log("Asking for permission for location");
    const setUp = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    setUp();
  }, []);

  useEffect(() => {
    //console.log("Setting up update interval")
    const interval = setInterval(() => {
      updateLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        console.log("Checking if trip is assigned");
        const checkIfTripAssigned = async () => {
          try {
            let userToken = await token.value();
            let response = await tryCheckIfTripAssigned(userToken);
            console.log("Get to " + GATEWAY_URL + ASSIGNED_TRIP_EP);
            console.log(response)
            if (response.status === HTTP_STATUS_OK && response.data == true) {
              navigation.navigate("TripOfferReceived");
            }
          } catch (error) {
            console.log("No trip assigned yet");
          }
        };
  
        checkIfTripAssigned();
      }, 5000);
      return () => clearInterval(interval);
    }, [])
  );

  return errorMsg ? (
    <View
      style={[
        styles.container,
        { backgroundColor: "#FFF", alignItems: "center" },
      ]}
    >
      <Text>{errorMsg}</Text>
      <Text>Give Location permissions to start waiting for trip offers</Text>
    </View>
  ) : (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Image
        source={loadingGif}
        style={{ height: 200, width: 200, resizeMode: "contain" }}
      />
      <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
        Waiting for Trip Offer...
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "yellow" }]}
        onPress={() => {
          navigation.navigate("TripOfferReceived");
          console.log("Skipping to TripOfferReceived");
        }}
      >
        <Text style={styles.buttonText}>Advance to trip offer (dev)</Text>
      </TouchableOpacity>
    </View>
  );
}
