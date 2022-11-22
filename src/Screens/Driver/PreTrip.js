import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { styles } from "../../Styles";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { mapContext } from "../../MapContext";
import { getUserStatus, getUserToken } from "../../UserContext";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
import { TRIPS_EP, GATEWAY_URL, INITIALIZE_TRIP,GOOGLE_MAPS_APIKEY } from "../../Constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { tryChangeTripState } from "../Utils";
import { map_styles } from "../../MapStyles";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
function tryGetTripInfo(trip_id) {
  return axios.get(GATEWAY_URL + TRIPS_EP + trip_id);
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
export default function PreTrip({ route }) {
  const [srcStreet, setSrcStreet] = useState("");
  const [srcStreetNumber, setSrcStreetNumber] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let response = await tryGetTripInfo(trip_id);
        let { src_address, src_number } = response.data;
        setSrcStreet(src_address);
        setSrcStreetNumber(src_number);
        setDestinationAddress({street: src_address, streetNumber: src_number})
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  //FIXME: what happens if get to passenger address fails?
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);

  const { data } = route.params;
  const { passenger, trip_id } = data;
  let { setDestinationAddress } = context.setters;
  let { userLocation, userAddress } = context.values;

  return (
    <View
      style={map_styles.container
      }
    >
      <View>
      <Text style={{ color: "#000", fontSize: 20,marginTop: 50 }}>
        Your passenger is waiting at {srcStreet}, {srcStreetNumber}
      </Text>

      <Text style={{ color: "#000", fontSize: 20 }}>
        My current address is {userAddress.street}, {userAddress.streetNumber}
      </Text>
      <Text style={{ color: "#000", fontSize: 20, marginBottom: 10 }}>
        Pick them up and start the trip!
      </Text>
      </View>
      <DriverMapView />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "yellow", padding: 20 }]}
        onPress={async () => {
          try {
            let userToken = await token.value();
            let response = await tryChangeTripState(
              userToken,
              trip_id,
              INITIALIZE_TRIP
            );
            navigation.navigate("DriverTrip", {
              data: { passenger: passenger, trip_id: trip_id },
            });
          } catch (e) {
            //For later: error code for this is 400
            console.log(e);
            Alert.alert(
              "Can't start trip",
              "Please get close to the passenger and pick them up!"
            );
          }
        }}
      >
        <Text style={styles.buttonText}>Start Trip</Text>
      </TouchableOpacity>
    </View>
  );
}
const mapRef = React.createRef();

function DriverMapView() {
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);

  let { userLocation, destinationAddress, destinationCoords } = context.values;
  let { setDestinationCoords } = context.setters;
  const { width, height } = Dimensions.get("window");

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  useEffect(() => {
    (async () => {
      try{
        let address = destinationAddress.street + " " + destinationAddress.streetNumber
        let coords = await getCoordsFromAddress(address)
        setDestinationCoords(coords)
      }
      catch(error){
        console.log(error)
      }
    })()
  })

  return (
    <>
    <MapView
      ref={mapRef}
      style={map_styles.map}
      region={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
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
          origin={userLocation}
          destination={destinationCoords}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={6}
          strokeColor="cornflowerblue"
        />
      ) : null}
    </MapView>
    </>
  );
}
