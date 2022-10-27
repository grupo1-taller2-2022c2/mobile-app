import React, { useState } from "react";
import { styles } from "../../Styles";
import axios from "axios";
import Constants from "expo-constants";
import { userToken } from "../../UserContext";

import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { API_GATEWAY_PORT, ADD_VEHICLE_EP } from "../../Constants";

const localhost = Constants.manifest.extra.localhost;
const apiUrl = "http://" + localhost + ":" + API_GATEWAY_PORT + ADD_VEHICLE_EP;

function alertWrongCredentials() {
  Alert.alert("Please enter valid vehicle credentials!");
}

function tryAddVehicle(licence_plate, model, token) {
  return axios.post(apiUrl, {
    licence_plate: licence_plate,
    model: model,
  }, {headers: { Authorization: "Bearer " + token }});
}
export default function DriverRegister(props) {
  const [licence_plate, onChangeLicencePlate] = useState("");
  const [model, onChangeModel] = useState("");
  const token = userToken();

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
          tryAddVehicle(licence_plate, model, token.value())
            .then(() => {
              Alert.alert("Successfully added vehicle!");
              props.navigation.navigate("Home");
            })
            .catch((e) => {
              console.log(e);
              alertWrongCredentials();
            });
        }}
      >
        <Text style={styles.buttonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}
