import { styles } from "../Styles";
import { mapContext, MapContextProvider } from "../MapContext";
import { GENERIC_ERROR_MSG } from "../Constants";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import * as React from "react";
import { API_GATEWAY_PORT, TRIPS_EP, HTTP_STATUS_OK, GATEWAY_URL } from "../Constants";

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
import {NavigationContext} from "@react-navigation/native";


function tryGetTripState(token, tripID) {
    console.log("Get to " + GATEWAY_URL + TRIPS_EP + tripID);
    return axios.get(GATEWAY_URL + TRIPS_EP + tripID, {
        headers: { Authorization: "Bearer " + token },
    });
}

export default function WaitingForTripToEnd({ route }) {
    const userStatus = getUserStatus();
    const token = getUserToken();
    const navigation = React.useContext(NavigationContext);
    console.log(route.params);
    let data = route.params.data;
    let driver = route.params.asignedDriver;
    console.log(driver);
    let tripID = data.id;

    async function hasTripEnded(tripID) {
        try {
            let userToken = await token.value();
            const response = await tryGetTripState(userToken, tripID);
            if (response.status === HTTP_STATUS_OK) {
                if (response.data.state === "Completed") {
                    navigation.replace("RateTrip", { data: response.data, asignedDriver: driver });
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
            console.log("Asking if trip has ended...");
            hasTripEnded(tripID);
        }, 5000);

        return () => clearInterval(interval)
    });

    return (
        <View style={[styles.container, { alignItems: "center" }]}>
            <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
                You're now driving safely to your location!{"\n"}
                You will be at your destination soon!
            </Text>
        </View>
    );
}