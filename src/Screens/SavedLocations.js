import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    Image, FlatList
} from "react-native";
import { styles } from "../Styles";
import ethLogo from "../../assets/eth_logo.png";
import loadingGif from "../../assets/loading-gif.gif";
import { useState, useEffect } from 'react';
import {useWindowDimensions} from 'react-native';
import axios from 'axios';
import {GATEWAY_URL, SIGNIN_EP, USERS_URI, WALLETS_URI, WALLET_WITHDRAWAL_URI} from "../Constants";
import {getUserStatus, getUserToken} from "../UserContext";
import * as React from "react";
import {NavigationContext} from "@react-navigation/native";
import {SAVED_LOCATION} from "../Constants";

function tryCreateLocation(locationName, locationStreet, locationAddr, userToken) {
    return axios.post(
        GATEWAY_URL + SAVED_LOCATION,
        {
            location: locationName,
            street_name: locationStreet,
            street_num: locationAddr
        },
        { headers: { Authorization: "Bearer " + userToken } }
    );
}

const LocationItem = ({locationName, locationStreet, locationAddr}) => (
    <View style={{backgroundColor: 'red', width: '100%', marginTop:20}}>
        <Text style={{fontSize: 20}}>
            {locationName} ===> {locationStreet} {locationAddr}
        </Text>
    </View>
)

export default function SavedLocations() {
    const [savedLocations, updateSavedLocations] = useState([]);
    const windowHeight = useWindowDimensions().height;
    const userStatus = getUserStatus();
    const token = getUserToken();
    const navigation = React.useContext(NavigationContext);
    const [locationName, setLocationName] = useState("");
    const [locationStreet, setLocationStreet] = useState("");
    const [locationAddr, setLocationAddr] = useState("");

    const refreshLocations = () => {
        token.value().then(
            (userToken) => {
                axios
                    .get(GATEWAY_URL + SAVED_LOCATION, {
                        headers: {Authorization: 'Bearer ' + userToken}
                    })
                    .then((response) => {
                        updateSavedLocations(response.data);
                    })
                    .catch((e) => {
                        Alert.alert(`Couldn't fetch saved locations. Try again later`, `Error ${e.response.status}: ${e.message}`);
                        navigation.navigate("Home");
                    });
            }).catch((e) => {
            console.log("Token not found");
            Alert.alert("Something went wrong!");
            userStatus.signInState.signOut();
        })
    };

    const renderLocation = (location) => {
        return <LocationItem
            locationName={location.item.location}
            locationStreet={location.item.street_name}
            locationAddr={location.item.street_num}
        />
    };

    useEffect(refreshLocations, []);

    return (
        <View style={[styles.container, { minHeight: Math.round(windowHeight), alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.title, {marginTop:50, fontSize: 40}]}>Saved Locations</Text>
            <View style={[styles.container, {width: "100%", marginTop:20, alignItems: "center", justifyContent: "center" }]}>
                <View style={[styles.container, {width: "100%"}]}>
                    <Text style={styles.text}>
                        Enter a location you want to add!
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setLocationName}
                        value={locationName}
                        placeholder="Name"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setLocationStreet}
                        value={locationStreet}
                        placeholder="Street"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setLocationAddr}
                        value={locationAddr}
                        placeholder="1234"
                        keyboardType={"number-pad"}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            token.value().then( (token) => {
                                tryCreateLocation(locationName, locationStreet, locationAddr, token)
                                .then((response) => {
                                    Alert.alert("Successful creation!");
                                    refreshLocations();
                                })
                                .catch((e) => {
                                    refreshLocations();
                                });
                            })
                        }}
                    >
                        <Text style={{color: "#fff", fontSize: 18}}>Create</Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderWidth: 2, borderRadius:40, borderColor: "grey", height: 300, width: 400,
                    alignItems: "center", justifyContent: "center"}}>
                    <View style={{ marginTop:50, marginBottom:50, alignItems: "center", justifyContent: "center", height: 250,
                        width: 330}}>
                        <FlatList
                            data={savedLocations}
                            renderItem={renderLocation}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity style={[styles.button,{marginTop: 10, marginBottom:50}]} onPress={() => {
                navigation.navigate("Home")
            }} >
                <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}