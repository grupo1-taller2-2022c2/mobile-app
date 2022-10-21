import * as React from "react";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from "react-native";

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
  /*try {
    let addresses =  await Location.reverseGeocodeAsync(coords[0])
    Alert.alert("Got address: " + addresses[0].name);
  }
  catch(error){
    Alert.alert("Error Catch", "E: " + error);
  }*/
}

export default function Map({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [destinationInput, onChangeDestinationInput] = useState(null);
  const [destinationMarkerCoords, setDestinationMarkerCoords] = useState(null);
  const [tripModalVisible, setTripModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return errorMsg ? (
    <View style={map_styles.container}>
      <Text>{errorMsg}</Text>
      <Text>Give Location permissions to access map</Text>
    </View>
  ) : location ? (
    <View style={map_styles.map_container}>
      <View style={{ margin: 50, marginBottom: 10 }}>
        <Text style={map_styles.title}>Please enter your destination</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={map_styles.input}
            onChangeText={onChangeDestinationInput}
            value={destinationInput}
            placeholder="Destination..."
            //autoCapitalize="none"
          />
          <TouchableOpacity
            style={map_styles.button}
            onPress={() => {
              getCoordsFromAddress(destinationInput).then(
                (input_coordinates) => {
                  if (!input_coordinates) {
                    Alert.alert("Error", "Invalid address");
                    return;
                  }
                  setDestinationMarkerCoords(input_coordinates);
                  mapRef.current.animateToRegion(
                    {
                      latitude: input_coordinates.latitude,
                      longitude: input_coordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    1200
                  );
                  //FIXME: this could be made by waiting for the animation to finish
                  setTimeout(() => {setTripModalVisible(true)}, 1700);
                  
                }
              );
            }}
          >
            <Text style={map_styles.buttonText}>Go!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[map_styles.button, { backgroundColor: "yellow" }]} onPress={() => {
            onChangeDestinationInput("Plaza de mayo")
          }}>
            <Text
              style={map_styles.buttonText}
            >
              FF(dev)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        ref={mapRef}
        style={map_styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.001,
        }}
        showsUserLocation={true}
      >
        {destinationMarkerCoords ? (
          <MapView.Marker
            title="Destination"
            coordinate={destinationMarkerCoords}
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
              <Text style={modal_styles.modalText}>Do you want to start a search for a driver to go to this destination?</Text>
              <Pressable
                style={[modal_styles.button, modal_styles.buttonClose]}
                onPress={() => setTripModalVisible(!tripModalVisible)}
              >
                <Text style={modal_styles.textStyle}>Start the search!</Text>
              </Pressable>
              <Pressable
                style={[modal_styles.button, modal_styles.buttonClose]}
                onPress={() => setTripModalVisible(!tripModalVisible)}
              >
                <Text style={modal_styles.textStyle}>No, choose another destination</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  ) : (
    <View style={map_styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const map_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map_container: {
    //flex: 1,
    //backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "flex-start",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
  },
  title: {
    color: "black",
    //textAlign: "center",
    marginBottom: 10,
    fontSize: 25,
  },
  button: {
    justifyContent: "space-around",
    backgroundColor: "lightskyblue",
    padding: 10,
    borderColor: "dodgerblue",
    borderRadius: 8,
    alignItems: "center",
    margin: 12,
    marginLeft: 0,
  },
  buttonText: {
    fontSize: 15,
  },
  input: {
    margin: 12,
    marginLeft: 0,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 8,
    flex: 1,
  },
});



const modal_styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    justifyContent: "space-around",
    backgroundColor: "lightskyblue",
    padding: 10,
    borderColor: "dodgerblue",
    borderRadius: 8,
    alignItems: "center",
    margin: 12,
    marginLeft: 0,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  }
});