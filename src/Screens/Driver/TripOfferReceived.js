import loadingGif from "../../../assets/loading-gif.gif";
import { styles } from "../../Styles";
import { mapContext, MapContextProvider } from "../../MapContext";
import { GENERIC_ERROR_MSG } from "../../Constants";
import { getUserStatus, getUserToken } from "../../UserContext";
import axios from "axios";
import {
  TRIPS_EP,
  HTTP_STATUS_OK,
  GATEWAY_URL,
  UPDATE_LOCATION_EP,
  DENY_TRIP,
  ACCEPT_TRIP
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
import {tryChangeTripState, tryDeleteDriverLastLocation} from '../Utils'


export default function TripOfferReceived({route}) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const context = mapContext();
  const navigation = React.useContext(NavigationContext);
  const [tripAcceptionPending, setTripAcceptionPending] = useState(true);
  //FIXME: maybe receive from context
  const {data} = route.params
  let {passenger,trip_id, passenger_email} = data
  passenger = {...passenger, email: passenger_email}

  const handleTripRejection = async () => {
    console.log(passenger)
    console.log(passenger_data)
    try {
      const userToken = await token.value()
      const response = await tryChangeTripState(userToken, trip_id, DENY_TRIP);
      
      if (response.status === HTTP_STATUS_OK) {
        await tryDeleteDriverLastLocation(userToken)
        navigation.navigate("DriverHome");
      } 
    } catch (error) {
      console.log(error)
      Alert.alert(GENERIC_ERROR_MSG);
      userStatus.signInState.signOut();
    }
  }

  const handleTripAcceptance = async () => {
    try {
      const userToken = await token.value()
      const response = await tryChangeTripState(userToken, trip_id, ACCEPT_TRIP);
      if (response.status === HTTP_STATUS_OK) {
        navigation.navigate("PreTrip",{ data: {passenger: passenger, trip_id: trip_id} });
      } 
    } catch (error) {
      console.log(error)
      Alert.alert(GENERIC_ERROR_MSG);
      userStatus.signInState.signOut();
    }
  }
  /*const mock_profile = {
    username: "Pasajero",
    surname: "De mentira",
    ratings: 3,
  };*/
  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
        Trip Offer Received!
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 25 }]}>
        Passenger details:
      </Text>
      <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
        Name: {passenger.username}
        {"\n"}Surname: {passenger.surname}
        {"\n"}Ratings:{passenger.ratings}/5
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
            if (tripAcceptionPending){
              handleTripRejection()}
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
            setTripAcceptionPending(false)
            handleTripAcceptance();
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
            setTripAcceptionPending(false)
            handleTripRejection()
          }}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
