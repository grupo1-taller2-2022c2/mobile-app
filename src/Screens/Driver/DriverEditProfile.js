import React, { useState } from "react";
import { styles } from "../../Styles";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';

import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Image,
} from "react-native";
import {EDIT_DRIVER_PROF_EP, GATEWAY_URL, SESSION_EXPIRED_MSG} from "../../Constants";
import {getUserStatus, getUserToken} from "../../UserContext";
import profilePicture from "../../../assets/user-placeholder.png";

function tryEditProfile(name, surname, license, model, token) {
    return axios.patch(GATEWAY_URL + EDIT_DRIVER_PROF_EP, {
        username: name,
        surname: surname,
        ratings: 0, // Legacy
        photo: "", // Legacy
        licence_plate: license,
        model: model
    }, {
        headers: { Authorization: "Bearer " + token },
    });
}

function PickAnImage() {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={{alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, resizeMode: "contain"}} />}
            {!image && <Image source={profilePicture} style={{height: 200, width:200, resizeMode: "contain"}}/>}
            <Text>{"\n"}</Text>
            <Button title="Pick an image" onPress={pickImage} />
        </View>
    );
}

export default function DriverEditProfile({route, navigation}) {
    const {data} = route.params;
    const [name, onChangeName] = useState(data.username);
    const [surname, onChangeSurname] = useState(data.surname);
    const [licence_plate, onChangeLicence] = useState(data.licence_plate);
    const [model, onChangeModel] = useState(data.model);

    const token = getUserToken();
    const userStatus = getUserStatus();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontSize: 15 }]}>
                Please, enter your new profile information!
            </Text>
            <PickAnImage/>
            <Text>{"\n"}</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder="Enter New Name"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeSurname}
                value={surname}
                placeholder="Enter New Surname"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeLicence}
                value={licence_plate}
                placeholder="Enter New License Plate"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeModel}
                value={model}
                placeholder="Enter New Car Model"
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
                            userStatus.signInState.signOut();
                        })
                        .then((token) => {
                            return tryEditProfile(name, surname, licence_plate, model, token);
                        })
                        .then(() => {
                            Alert.alert("Successful profile change!");
                            data.username = name;
                            data.surname = surname;
                            data.licence_plate = licence_plate;
                            data.model = model;
                            navigation.navigate("DriverMyProfile", {data: data});
                        })
                        .catch((e) => {
                            console.log(e);
                            //FIXME: is this truly the only error case?
                            Alert.alert(SESSION_EXPIRED_MSG);
                            userStatus.signInState.signOut();
                        });
                }}
            >
                <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "yellow" }]}
                onPress={() => {
                    //FIXME: delete this
                    onChangeName("maticito");
                    onChangeSurname("el crack");
                    onChangeLicence("100gecs");
                    onChangeModel("fitito");
                }}
            >
                <Text style={styles.buttonText}>Fast Fill-in(dev)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{marginTop: 70}]} onPress={() => {
                navigation.navigate("DriverMyProfile", {data: data})
            }} >
                <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}