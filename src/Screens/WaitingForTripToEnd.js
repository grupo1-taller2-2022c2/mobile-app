import { styles } from "../Styles";
import { mapContext, MapContextProvider } from "../MapContext";
import {GENERIC_ERROR_MSG, GOOGLE_MAPS_APIKEY, HTTP_STATUS_CREATED, UPDATE_LOCATION_EP} from "../Constants";
import { getUserStatus, getUserToken } from "../UserContext";
import axios from "axios";
import * as React from "react";
import { TRIPS_EP, HTTP_STATUS_OK, GATEWAY_URL, REPORT_DRIVER } from "../Constants";
import * as Location from "expo-location";
import passengerMarker from "../../assets/passengerMarker.png";
import driverMarker from "../../assets/driverMarker.png";
import reportFlag from "../../assets/reportFlag.png";

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
import {map_styles, modal_styles} from "../MapStyles";
import MapViewDirections from "react-native-maps-directions";
import ProfileCard from "../components/ProfileCard"


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

function tryReportDriver(driver_email, trip_id, reason, token) {
    return axios.post(GATEWAY_URL + REPORT_DRIVER, {
        driver_email: driver_email,
        trip_id: trip_id,
        reason: reason
    }, {
        headers: { Authorization: "Bearer " + token },
    });
}

function tryDriverLocation(driver_email, token) {
    return axios.get(GATEWAY_URL + UPDATE_LOCATION_EP + '/' + driver_email, {
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

    const [userLocation, setUserLocation] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportMessage, onChangeReportMessage] = useState("");
    const [driverArrived, setDriverArrived] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(true);

    async function hasTripEnded(tripID) {
        try {
            let userToken = await token.value();
            const response = await tryGetTripState(userToken, tripID);
            if (response.status === HTTP_STATUS_OK) {
                if (response.data.state === "In course" ) {
                    setDriverArrived(true);
                } else if (response.data.state === "Completed") {
                    navigation.replace("RateTrip", { data: response.data, asignedDriver: driver });
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", GENERIC_ERROR_MSG);
            userStatus.signInState.signOut();
        }
    }

    async function tryToReportDriver(driver, tripID) {
        try {
            let userToken = await token.value();
            const response = await tryReportDriver(driver.email, tripID, reportMessage, userToken);
            if (response.status === HTTP_STATUS_CREATED) {
                Alert.alert(`You successfully reported ${driver.username}`, "Thanks for your feedback")
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", GENERIC_ERROR_MSG);
            userStatus.signInState.signOut();
        }
    }

    async function tryGettingDriverLocation() {
            let userToken = await token.value();
            tryDriverLocation(driver.email, userToken)
            .then( async (response) => {
                const driverLoc = await getCoordsFromAddress(
                    response.data.street_name + " " + response.data.street_num
                );
                if (driverLoc) {
                    setDriverLocation(driverLoc);
                }
            }).catch( (e) => {
                console.log(e);
                Alert.alert("Error", GENERIC_ERROR_MSG);
                userStatus.signInState.signOut();
            })
    }

    useEffect(() => {
        const trySettingLocation = (async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation});
            setUserLocation(location);
        });
        const interval = setInterval(() => {
            driverArrived ? trySettingLocation() : tryGettingDriverLocation();
            console.log("Asking if trip has ended...");
            hasTripEnded(tripID);
        }, 5000);

        return () => clearInterval(interval)
    });

    return (
        <View style={[styles.container, { alignItems: "center" }]}>
            <MapView
                ref={mapRef}
                style={map_styles.map_in_trip}
                initialRegion= {{
                    latitude: sourceCoords.latitude,
                    longitude: sourceCoords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                showsUserLocation={false}
                toolbarEnabled={false}
            >
                <MapView.Marker title="Destination" coordinate={destinationCoords} />
                {(driverArrived && userLocation) || (!driverArrived && driverLocation) ? (
                    <MapView.Marker title={driverArrived? "Actual Location" : "Driver Location"} image={driverArrived? passengerMarker : driverMarker}
                                    coordinate={driverArrived? userLocation.coords : driverLocation} />
                ) : null}
                <MapViewDirections
                    origin={sourceCoords}
                    destination={destinationCoords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor="cornflowerblue"
                />
            </MapView>
            {reportModalVisible ? (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={reportModalVisible}
                    onRequestClose={() => {
                        setReportModalVisible(!reportModalVisible);
                    }}
                >
                    <View style={modal_styles.centeredView}>
                        <View style={modal_styles.modalView}>
                            <Text style={modal_styles.modalText}>
                                Are you sure you want to report {driver.username}?
                            </Text>
                            <Text style={modal_styles.modalText + {fontsize: 5}}>
                                At least give us a reason...
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeReportMessage}
                                value={reportMessage}
                                placeholder="Insert your reason here!"
                            />
                            <Pressable
                                style={({pressed}) => [modal_styles.button,
                                    {backgroundColor: pressed? 'pink' : 'red'}]}
                                onPress={() => {
                                    tryToReportDriver(driver, tripID);
                                    setReportModalVisible(!reportModalVisible);
                                }}
                            >
                                <Text style={modal_styles.textStyle}>Report User</Text>
                            </Pressable>
                            <Pressable
                                style={({pressed}) => [modal_styles.button,
                                    pressed? modal_styles.buttonPressed : modal_styles.buttonNoPress]}
                                onPress={() => {
                                    setReportModalVisible(!reportModalVisible);
                                }}
                            >
                                <Text style={modal_styles.textStyle}>
                                    No, nevermind
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            ) : null}
            {profileModalVisible ? (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={profileModalVisible}
                    onRequestClose={() => {
                        setProfileModalVisible(!profileModalVisible);
                    }}
                >
                    <View style={modal_styles.centeredView}>
                        <View style={[modal_styles.modalView, {alignItems:'center'}]}>
                            <Text style={[modal_styles.modalText, {fontSize: 25, fontWeight: "bold"}]}>
                                Meet your Driver!
                            </Text>
                            <ProfileCard data={{data: driver}} isDriver={true} modal={true} notUpdate={true}/>
                            <Pressable
                                style={({pressed}) => [modal_styles.button,
                                    {marginTop:20, margin:'auto'},
                                    pressed? modal_styles.buttonPressed : modal_styles.buttonNoPress]}
                                onPress={() => {
                                    setProfileModalVisible(!profileModalVisible);
                                }}
                            >
                                <Text style={modal_styles.textStyle}>
                                    Got it!
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            ) : null}
            {driverArrived ? (
                <TouchableOpacity
                    onPress={() => setReportModalVisible(true)}
                    style={{position: 'absolute', bottom: 10, right: 10, height:50, width:50}}
                >
                    <Image
                        source={reportFlag}
                        style={
                            {height:50, width:50, bottom:20, right:10}
                        }
                    />
                </TouchableOpacity>
            ) : null}
            <TouchableOpacity
                onPress={() => setProfileModalVisible(true)}
                style={{position: 'absolute', top: 80, right: 10, height:50, width:50}}
            >
                <Image
                    source={driver.photo ? {uri: driver.photo} : passengerMarker}
                    style={
                        {height:80, width:80, bottom:20, right:30, borderRadius: 100,
                            borderWidth:2, borderColor:"black",  overflow: "hidden"}
                    }
                />
            </TouchableOpacity>
        </View>
    );
}