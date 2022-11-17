import * as React from "react";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {
  GOOGLE_MAPS_APIKEY,
  TRIP_COST_EP,
  API_GATEWAY_PORT,
  SESSION_EXPIRED_MSG,
  GOOGLE_DISTANCE_MATRIX_URL,
  HTTP_STATUS_UNAUTHORIZED,
  CREATE_TRIP_EP,
  GATEWAY_URL
} from "../Constants";
import { mapContext } from "../MapContext";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import { map_styles, modal_styles } from "../MapStyles";
import { NavigationContext } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANIMATION_DURATION = 1200;
const PROMPT_WAIT_TIME = 1900;

import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";


function tryGetTripPrice(
  token,
  src_street,
  src_number,
  dst_street,
  dst_number,
  duration,
  distance
) {
  return axios.get(GATEWAY_URL + TRIP_COST_EP, {
    headers: { Authorization: "Bearer " + token },
    params: {
      src_address: src_street,
      src_number: src_number,
      dst_address: dst_street,
      dst_number: dst_number,
      duration: duration,
      distance: distance,
    },
  });
}

function tryGetTripDistanceAndTime(origin, destination) {
  return axios.get(GOOGLE_DISTANCE_MATRIX_URL, {
    params: {
      origins: encodeURI(origin),
      destinations: encodeURI(destination),
      key: encodeURI(GOOGLE_MAPS_APIKEY),
    },
  });
}

function tryCreateTrip(
  token,
  src_address,
  src_number,
  dst_address,
  dst_number,
  duration,
  distance
) {
  return axios.post(
    GATEWAY_URL + CREATE_TRIP_EP,
    {
      src_address: src_address,
      src_number: src_number,
      dst_address: dst_address,
      dst_number: dst_number,
      duration: duration,
      distance: distance,
      //trip_type: "NORMAL",
    },
    { headers: { Authorization: "Bearer " + token } }
  );
}

const mapRef = React.createRef();

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

function SearchTab() {
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();

  let {
    setTripModalVisible,
    onChangeDestinationInput,
    setDestinationCoords,
    setDestinationAddress,
    setEstimatedTripPrice,
  } = context.setters;
  let { destinationInput, userAddress, userLocation } = context.values;

  return (
    <View style={{ margin: 50, marginBottom: 10 }}>
      <Text style={map_styles.title}>Please enter your destination</Text>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={map_styles.input}
          onChangeText={onChangeDestinationInput}
          value={destinationInput}
          placeholder="Destination..."
        />
        <TouchableOpacity
          style={map_styles.button}
          onPress={async () => {
            try {
              let input_coordinates = await getCoordsFromAddress(
                destinationInput
              );
              if (input_coordinates === null) {
                Alert.alert("Please enter a valid address");
                return;
              }

              setDestinationCoords(input_coordinates);
              //FIXME no other error case?
              let addresses = await Location.reverseGeocodeAsync({
                latitude: input_coordinates.latitude,
                longitude: input_coordinates.longitude,
              });

              let currentDestAddress = addresses[0];

              setDestinationAddress(addresses[0]);

              let userToken;
              try {
                userToken = await token.value();
              } catch (e) {
                //Should be unreachable
                console.log("Token not found");
                Alert.alert("Something went wrong!");
                userStatus.signInState.signOut();
              }

              let originGoogle =
                userLocation.coords.latitude +
                "," +
                userLocation.coords.longitude;
              let destinationGoogle =
                input_coordinates.latitude + "," + input_coordinates.longitude;

              let response = await tryGetTripDistanceAndTime(
                originGoogle,
                destinationGoogle
              );
              let { distance, duration } = response.data.rows[0].elements[0];

              let tripPriceResponse = await tryGetTripPrice(
                userToken,
                userAddress.street,
                userAddress.streetNumber,
                currentDestAddress.street,
                currentDestAddress.streetNumber,
                duration.value / 60,
                distance.value
              );

              let tripPrice = Math.round(tripPriceResponse.data.price);
              console.log("Estimated price: " + tripPrice);
              setEstimatedTripPrice(tripPrice);

              mapRef.current.animateToRegion(
                {
                  latitude: input_coordinates.latitude,
                  longitude: input_coordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                ANIMATION_DURATION
              );

              //FIXME: this could be made by waiting for the animation to finish
              setTimeout(() => {
                setTripModalVisible(true);
              }, PROMPT_WAIT_TIME);
            } catch (error) {
              if (error.response.status) {
                const status_code = error.response.status;
                if (status_code == HTTP_STATUS_UNAUTHORIZED) {
                  Alert.alert(SESSION_EXPIRED_MSG);
                  userStatus.signInState.signOut();
                  return;
                }
              }
              //FIXME: differentiate error cases here
              console.log(error)
              Alert.alert("Error", "Could not resolve, try again!");
            }
          }}
        >
          <Text style={map_styles.buttonText}>Go!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[map_styles.button, { backgroundColor: "yellow" }]}
          onPress={() => {
            onChangeDestinationInput("Plaza de mayo");
          }}
        >
          <Text style={map_styles.buttonText}>FF(dev)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MyMapView() {
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  let { setTripModalVisible, setTripID } = context.setters;
  let {
    userLocation,
    destinationCoords,
    tripModalVisible,
    destinationInput,
    userAddress,
    tripID
  } = context.values;
  const navigation = React.useContext(NavigationContext);

  //FIXME: temporary fix
  const [incomingNavigation, setIncomingNavigation] = React.useState(false);
  const [assignedDriver, setAssignedDriver] = React.useState(false);
  useEffect(() => {
    if (incomingNavigation) {
      navigation.navigate("WaitingForDriver", {
        assignedDriver: assignedDriver, tripID: tripID,
      });
    }
  }, [incomingNavigation]);

  return (
    <>
      <MapView
        ref={mapRef}
        style={map_styles.map}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation={true}
      >
        {destinationCoords ? (
          <MapView.Marker title="Destination" coordinate={destinationCoords} />
        ) : null}
        {destinationCoords ? (
          <MapViewDirections
            origin={userLocation.coords}
            destination={destinationCoords}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="cornflowerblue"
          />
        ) : null}
      </MapView>
      {tripModalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={tripModalVisible}
          onRequestClose={() => {
            setTripModalVisible(!tripModalVisible);
          }}
        >
          <View style={modal_styles.centeredView}>
            <View style={modal_styles.modalView}>
              <Text style={modal_styles.modalText}>
                Estimated Trip Price is ${context.values.estimatedTripPrice}.{" "}
                {"\n"}Do you want to start a search for a driver to go to this
                destination?
              </Text>
              <Pressable
                style={[modal_styles.button, modal_styles.buttonClose]}
                onPress={async () => {
                  try {
                    let userToken;
                    try {
                      userToken = await token.value();
                    } catch (e) {
                      //Should be unreachable
                      console.log("Token not found");
                      Alert.alert("Something went wrong!");
                      userStatus.signInState.signOut();
                    }
                    //FIXME: ALL THIS CODE IS COPIED FROM ANOTHER FUNCTION

                    let input_coordinates = await getCoordsFromAddress(
                      destinationInput
                    );

                    let addresses = await Location.reverseGeocodeAsync({
                      latitude: input_coordinates.latitude,
                      longitude: input_coordinates.longitude,
                    });

                    let currentDestAddress = addresses[0];

                    let originGoogle =
                      userLocation.coords.latitude +
                      "," +
                      userLocation.coords.longitude;
                    let destinationGoogle =
                      input_coordinates.latitude +
                      "," +
                      input_coordinates.longitude;

                    let response = await tryGetTripDistanceAndTime(
                      originGoogle,
                      destinationGoogle
                    );
                    let { distance, duration } =
                      response.data.rows[0].elements[0];

                    //END OF COPY CODE
                    console.log("token: " + userToken);
                    let create_response = await tryCreateTrip(
                      userToken,
                      userAddress.street,
                      userAddress.streetNumber,
                      currentDestAddress.street,
                      currentDestAddress.streetNumber,
                      duration.value / 60,
                      distance.value
                    );

                    let tripId = create_response.data[0];
                    console.log("Got tripID: " + tripId);
                    setTripID(tripId);
                    let assignedDriver = create_response.data[1];
                    if (assignedDriver === null) {
                      Alert.alert("There are no drivers available right now!");
                      setTripModalVisible(!tripModalVisible);
                      return;
                    }
                    /*navigation.navigate("WaitingForDriver", {
                      assignedDriver: assignedDriver,
                    })*/ 
                    setAssignedDriver(assignedDriver);
                    setIncomingNavigation(true);
                  } catch (e) {
                    console.log(e);
                    Alert.alert("Could not perform driver lookup");
                  }
                  setTripModalVisible(!tripModalVisible);
                }}
              >
                <Text style={modal_styles.textStyle}>Start the search!</Text>
              </Pressable>
              <Pressable
                style={[modal_styles.button, modal_styles.buttonClose]}
                onPress={() => {
                  setTripModalVisible(!tripModalVisible);
                }}
              >
                <Text style={modal_styles.textStyle}>
                  No, choose another destination
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

function MyMapScreen() {
  const context = mapContext();
  let { userLocation } = context.values;
  let { setUserLocation, setUserAddress } = context.setters;
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserAddress(addresses[0]);
    })();
  }, []);

  return errorMsg ? (
    <View style={map_styles.container}>
      <Text>{errorMsg}</Text>
      <Text>Give Location permissions to access map</Text>
    </View>
  ) : userLocation ? (
    <View style={map_styles.map_container}>
      <SearchTab />
      <MyMapView />
    </View>
  ) : (
    <View style={map_styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

export default function Map() {
  return (
    <>
      <MyMapScreen />
    </>
  );
}