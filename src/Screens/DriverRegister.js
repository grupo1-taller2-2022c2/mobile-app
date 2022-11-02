import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import Constants from "expo-constants";
import { getUserStatus, getUserToken } from "../UserContext";

import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { API_GATEWAY_PORT, ADD_VEHICLE_EP, SESSION_EXPIRED_MSG, GENERIC_ERROR_MSG, HTTP_STATUS_VALID_ERROR, HTTP_STATUS_UNAUTHORIZED } from "../Constants";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + ADD_VEHICLE_EP;

function alertWrongCredentials() {
  Alert.alert("Please enter valid vehicle credentials!");
}

function tryAddVehicle(licence_plate, model, token) {
  return axios.post(
    apiUrl,
    {
      licence_plate: licence_plate,
      model: model,
    },
    { headers: { Authorization: "Bearer " + token } }
  );
}
export default function DriverRegister(props) {
  const [licence_plate, onChangeLicencePlate] = useState("");
  const [model, onChangeModel] = useState("");
  const token = getUserToken();
  const userStatus = getUserStatus();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: 20 }]}>
        Please, enter your vehicle details:
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeLicencePlate}
        value={licence_plate}
        placeholder="Enter License Plate"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeModel}
        value={model}
        placeholder="Enter Model"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "dodgerblue" }]}
        onPress={() => {
          token
            .value()
            .catch((e) => {
              console.log("Token not found");
              Alert.alert("Something went wrong!");
              userStatus.signInState.signOut()
            })
            .then((token) => {
              return tryAddVehicle(licence_plate, model, token);
            })
            .then((response) => {
              console.log("then: " + response)
              userStatus.registeredAsDriver.setIsRegistered();
              Alert.alert("Successfully added vehicle!");
              props.navigation.navigate("Home");
            })
            .catch((e) => {
              const status_code = e.response.status;
              console.log("catch: " + e);
              if (status_code == HTTP_STATUS_VALID_ERROR) {
                alertWrongCredentials();
              }
              else if (status_code == HTTP_STATUS_UNAUTHORIZED){
                Alert.alert(SESSION_EXPIRED_MSG);
                userStatus.signInState.signOut();
              }
              else {
                Alert.alert(GENERIC_ERROR_MSG);
                userStatus.signInState.signOut();
              }
            });
        }}
      >
        <Text style={styles.buttonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}
