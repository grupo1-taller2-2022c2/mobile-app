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
} from "react-native";

export default function Map({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [destination, onChangeDestination] = useState(null);

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
    <View>
      <View style={{ margin: 50, marginBottom: 10 }}>
        <Text style={map_styles.title}>Please enter your destination</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={map_styles.input}
            onChangeText={onChangeDestination}
            value={destination}
            placeholder="Destination..."
            autoCapitalize="none"
          />
          <TouchableOpacity style={map_styles.button} onPress={() => {
            Alert.alert("Destination set to " + destination);
          }}>
          <Text style={map_styles.buttonText}>Go!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        style={map_styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      />
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
    flex:1,
  },
});
