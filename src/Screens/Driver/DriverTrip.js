import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image,
  Dimensions
} from "react-native";
import { styles } from "../../Styles";
import { mapContext } from "../../MapContext";
import { getUserStatus, getUserToken } from "../../UserContext";
import { NavigationContext } from "@react-navigation/native";
import * as React from "react";
import { TRIPS_EP, GATEWAY_URL, FINALIZE_TRIP, GOOGLE_MAPS_APIKEY } from "../../Constants";
import axios from "axios";
import { useState, useEffect } from "react";
import { tryChangeTripState } from "../Utils";
import { map_styles } from "../../MapStyles";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

function tryGetTripInfo(trip_id) {
  return axios.get(GATEWAY_URL + TRIPS_EP + trip_id);
}
//FIXME esta funcion de momento si la importas de utils no funciona
//por eso se repite
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
export default function DriverTrip({ route }) {
  const [dstStreet, setDstStreet] = useState("");
  const [dstStreetNumber, setDstStreetNumber] = useState("");
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);

  const { data } = route.params;
  const { passenger, trip_id } = data;

  let { setDestinationAddress } = context.setters;
  let { userLocation, userAddress } = context.values;

  useEffect(() => {
    (async () => {
      try {
        let response = await tryGetTripInfo(trip_id);
        let { dst_address, dst_number } = response.data;
        setDstStreet(dst_address);
        setDstStreetNumber(dst_number);
        setDestinationAddress({street: dst_address, streetNumber: dst_number})
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <View
      style={map_styles.container}
    > 
    <View>
      <Text style={{ color: "#000", fontSize: 20,marginTop: 50 }}>
        Your destination is at {dstStreet}, {dstStreetNumber}
      </Text>

      <Text style={{ color: "#000", fontSize: 20 }}>
        My current address is {userAddress.street}, {userAddress.streetNumber}
      </Text>
      <Text style={{ color: "#000", fontSize: 20, marginBottom: 10 }}>
        Go drop off the passenger!
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
              FINALIZE_TRIP
            );
            navigation.navigate("DriverRating",  {data: {passenger: passenger, trip_id: trip_id} })
          } catch (e) {
            //For later: error code for this is 400
            console.log(e);
            Alert.alert(
              "Can't end trip",
              "Please get close to the destination and drop off the passenger!"
            );
          }
        }}
      >
        <Text style={styles.buttonText}>Finish Trip</Text>
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
        console.log(address)
      }
      catch(error){
        console.log(error)
      }
    })()
  },[])

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