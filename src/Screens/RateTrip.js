import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import * as React from "react";
import { useState, useEffect } from "react";

import { getUserStatus, getUserToken } from "../UserContext";
import { NavigationContext } from "@react-navigation/native";
import { styles } from "../Styles";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import { GATEWAY_URL, DRIVER_RATE_EP } from "../Constants";

function tryRateDriver(token, driver_email, trip_id, rating, message) {
  return axios.post(
    GATEWAY_URL + DRIVER_RATE_EP,
    {
      driver_email: driver_email,
      trip_id: trip_id,
      ratings: rating,
      message: message,
    },
    { headers: { Authorization: "Bearer " + token } }
  );
}

export default function RateTrip({ route }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);
  let data = route.params.data;
  let driver = route.params.asignedDriver;
  let tripID = data.id;

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: 24 }]}>Rate your Driver!</Text>
      <Text style={[styles.text, { fontSize: 25 }]}>
        How would you rate {driver.username} {driver.surname} from 1 to 5 stars?
      </Text>
      <View style={{ alignItems: "center" }}>
        <StarRating rating={rating} onChange={setRating} starSize={64} />
      </View>
      <Text style={[styles.text, { fontSize: 18, marginTop:15 }]}>If you want, write a review!</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMessage}
        value={message}
        placeholder="Write your opinion here! (50 characters max)"
        height={70}
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "dodgerblue",
            marginTop: 40,
            justifyContent: "center",
          },
        ]}
        onPress={async () => {
          try {
            let userToken = await token.value();
            let response = await tryRateDriver(
              userToken,
              driver.email,
              tripID,
              rating,
              message
            );
            Alert.alert(
              "Rating submitted!",
              "You gave " +
                driver.username +
                " " +
                driver.surname +
                " " +
                rating +
                " stars!"
            );
            navigation.navigate("Home");
          } catch (e) {
            console.log(e);
            if (message.length > 50) {
                Alert.alert("Error", "Message too long! (50 characters max)")
                return
            }
            Alert.alert("Error", "Unable to process rating");
            navigation.navigate("Home");
          }
        }}
      >
        <Text style={[styles.buttonText, { fontSize: 24, color: "#FFF" }]}>
          Submit Rating
        </Text>
      </TouchableOpacity>
    </View>
  );
}
