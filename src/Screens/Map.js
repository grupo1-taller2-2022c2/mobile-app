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
} from "../Constants";
import { mapContext, MapContextProvider } from "./MapContext";
import Constants from "expo-constants";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import { map_styles, modal_styles } from "./MapStyles";

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

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + TRIP_COST_EP;

//FIXME this is hardcoded
function tryGetTripPrice(
  token,
  src_street,
  src_number,
  dst_street,
  dst_number,
  duration,
  distance
) {
  return axios.get(apiUrl, {
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

const mapRef = React.createRef();

async function getCoordsFromAddress(address) {
  let location;
  try {
    let result = await Location.geocodeAsync(address);
    location = result[0];
  } catch (error) {
    Alert.alert("Error", "Could not find the address");
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
    setValidInput,
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
          onPress={() => {
            getCoordsFromAddress(destinationInput).then((input_coordinates) => {
              if (!input_coordinates) {
                Alert.alert("Error", "Invalid address");
                return;
              }
              setDestinationCoords(input_coordinates);
              //FIXME no other error case?
              Location.reverseGeocodeAsync({
                latitude: input_coordinates.latitude,
                longitude: input_coordinates.longitude,
              })
                .then((addresses) => {
                  let currentDestAddress = addresses[0];
                  //Note: we cant use this state value in this scope!
                  setDestinationAddress(addresses[0]);
                  //Ask for estimated price to gateway
                  token
                    .value()
                    .catch((e) => {
                      console.log("Token not found");
                      Alert.alert("Something went wrong!");
                      userStatus.signInState.signOut();
                    })
                    .then((token) => {
                      console.log("Src Street: " + userAddress.street);
                      console.log("Src Number: " + userAddress.streetNumber);
                      console.log("Dst Street: " + currentDestAddress.street);
                      console.log(
                        "Dst Number: " + currentDestAddress.streetNumber
                      );
                      //test
                      let originGoogle =
                        userLocation.coords.latitude +
                        "," +
                        userLocation.coords.longitude;
                      let destinationGoogle =
                        input_coordinates.latitude +
                        "," +
                        input_coordinates.longitude;
                      tryGetTripDistanceAndTime(
                        originGoogle,
                        destinationGoogle
                      ).then((response) => {
                        let { distance, duration } =
                          response.data.rows[0].elements[0];
                        return tryGetTripPrice(
                          token,
                          userAddress.street,
                          userAddress.streetNumber,
                          currentDestAddress.street,
                          currentDestAddress.streetNumber,
                          duration.value / 60,
                          distance.value
                        )
                          .then((response) => {
                            console.log(
                              "Estimated price: " +
                                Math.round(response.data.price)
                            );
                            setEstimatedTripPrice(
                              Math.round(response.data.price)
                            );
                            //FIXME: same as below
                            setValidInput(true);
                            return;
                          })
                          .catch((e) => {
                            console.log(e);
                            Alert.alert(
                              "Please enter destination in address format"
                            );
                            //FIXME: temporary fix to not show modal after invalid input, should clean up code
                            setValidInput(false);
                            return;
                          });
                      });
                    })
                    .catch((e) => {
                      //FIXME add more error cases depending on response code
                      console.log(e);
                      Alert.alert(SESSION_EXPIRED_MSG);
                      userStatus.signInState.signOut();
                    });
                })
                .catch((e) => {
                  console.log(e);
                });

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
            });
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
  let { setTripModalVisible, setValidInput } = context.setters;
  let { userLocation, destinationCoords, tripModalVisible, validInput } =
    context.values;
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
      {tripModalVisible & validInput ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={tripModalVisible}
          onRequestClose={() => {
            setTripModalVisible(!tripModalVisible);
            setValidInput(!validInput);
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
                onPress={() => {
                  setTripModalVisible(!tripModalVisible);
                  setValidInput(!validInput);
                }}
              >
                <Text style={modal_styles.textStyle}>Start the search!</Text>
              </Pressable>
              <Pressable
                style={[modal_styles.button, modal_styles.buttonClose]}
                onPress={() => {
                  setTripModalVisible(!tripModalVisible);
                  setValidInput(!validInput);
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
    <MapContextProvider>
      <MyMapScreen />
    </MapContextProvider>
  );
}
