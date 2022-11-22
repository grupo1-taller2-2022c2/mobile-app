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

import { getUserStatus, getUserToken } from "../../UserContext";
import { NavigationContext } from "@react-navigation/native";
import { styles } from "../../Styles";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import {GATEWAY_URL, PASSENGER_RATE_EP} from '../../Constants'
import { tryDeleteDriverLastLocation } from "../Utils";

function tryRatePassenger(token, passenger_email, trip_id, rating, message) {
  return axios.post(
    GATEWAY_URL + PASSENGER_RATE_EP,
    {
      passenger_email: passenger_email,
      trip_id: trip_id,
      ratings: rating,
      message: message
    },
    { headers: { Authorization: "Bearer " + token } }
  );
}
export default function DriverRating({ route }) {
  const { data } = route.params;
  const { passenger, trip_id } = data;

  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: 24 }]}>Rate your passenger!</Text>
      <Text style={[styles.text, { fontSize: 25 }]}>
        How would you rate {passenger.username} {passenger.surname} from 1 to 5
        stars?
      </Text>
      <View style={{ alignItems: "center" }}>
        <StarRating rating={rating} onChange={setRating} starSize={64} />
      </View>
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
            try{
                let userToken = await token.value()
                //let response = await tryRatePassenger(userToken, passenger.email, trip_id, rating, null)
                Alert.alert(
                    "Rating submitted!",
                    "You gave " +
                      passenger.username +
                      " " +
                      passenger.surname +
                      " " +
                      rating +
                      " stars!"
                  );
                await tryDeleteDriverLastLocation(userToken)
                navigation.navigate("DriverHome");
            }
            catch(e){
                console.log(e)
                Alert.alert("Error", "Unable to process rating")
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
