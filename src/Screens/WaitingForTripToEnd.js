import { styles } from "../Styles";
import { mapContext, MapContextProvider } from "../MapContext";
import {GENERIC_ERROR_MSG, GOOGLE_MAPS_APIKEY} from "../Constants";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import * as React from "react";
import { TRIPS_EP, HTTP_STATUS_OK, GATEWAY_URL } from "../Constants";
import * as Location from "expo-location";
import ainsley from "../../assets/ainsley.png";

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
import MapView from "react-native-maps";
import {map_styles} from "../MapStyles";
import MapViewDirections from "react-native-maps-directions";


const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function tryGetTripState(token, tripID) {
    console.log("Get to " + GATEWAY_URL + TRIPS_EP + tripID);
    return axios.get(GATEWAY_URL + TRIPS_EP + tripID, {
        headers: { Authorization: "Bearer " + token },
    });
}

async function getCoordsFromAddress(address) {
    let location;
    try {
        let result = await Location.geocodeAsync(address);
        if (result.length === 0) {
            return null;
        }
        location = result[0];
    } catch (error) {
        return null;
    }
    return location;
}

const mapRef = React.createRef();

export default function WaitingForTripToEnd({ route }) {
    const userStatus = getUserStatus();
    const token = getUserToken();
    const navigation = React.useContext(NavigationContext);
    console.log(route.params);
    let data = route.params.data;
    let driver = route.params.asignedDriver;
    console.log(driver);
    let tripID = data.id;
    let sourceCoords = route.params.sourceCoords;
    let destinationCoords = route.params.destinationCoords;

    const [userLocation, setUserLocation] = React.useState(null);

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
        const trySettingLocation = (async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation});
            setUserLocation(location);
        });
        const interval = setInterval(() => {
            trySettingLocation();
            console.log("Asking if trip has ended...");
            hasTripEnded(tripID);
        }, 5000);

        return () => clearInterval(interval)
    });

    return (
        <View style={[styles.container, { alignItems: "center" }]}>
            <Text style={[styles.text, { margin: 30, fontSize: 30 }]}>
                You're now being driven safely to your location!{"\n"}
                You will be at your destination soon!
            </Text>
            <MapView
                ref={mapRef}
                style={map_styles.map}
                initialRegion= {{
                    latitude: sourceCoords.latitude,
                    longitude: sourceCoords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                showsUserLocation={false}
            >
                <MapView.Marker title="Destination" coordinate={destinationCoords} />
                {userLocation ? (
                    <MapView.Marker title="UserLoc" image={ainsley} coordinate={userLocation.coords} />
                ) : null}
                <MapViewDirections
                    origin={sourceCoords}
                    destination={destinationCoords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor="cornflowerblue"
                />
            </MapView>
        </View>
    );
}