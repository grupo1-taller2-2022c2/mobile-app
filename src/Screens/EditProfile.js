import React, { useState } from "react";
import { styles } from "../Styles";
import axios from "axios";
import Constants from "expo-constants";
import * as ImagePicker from 'expo-image-picker';

import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Image,
} from "react-native";
import {EDIT_PROF_EP, GATEWAY_URL, SESSION_EXPIRED_MSG} from "../Constants";
import {getUserStatus, getUserToken} from "../UserContext";
import profilePicture from "../../assets/user-placeholder.png";


function tryEditProfile(name, surname, token) {
    return axios.patch(GATEWAY_URL + EDIT_PROF_EP, {
        username: name,
        surname: surname,
        ratings: 0, // Legacy
        photo: "" // Legacy
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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, resizeMode: "contain"}} />}
            {!image && <Image source={profilePicture} style={{height: 200, width:200, resizeMode: "contain"}}/>}
            <Text>{"\n"}</Text>
            <Button title="Pick an image" onPress={pickImage} />
        </View>
    );
}

export default function EditProfile({route, navigation}) {
    const {data} = route.params;
    const [name, onChangeName] = useState(data.username);
    const [surname, onChangeSurname] = useState(data.surname);

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
                            return tryEditProfile(name, surname, token);
                        })
                        .then(() => {
                            Alert.alert("Successful profile change!");
                            data.username = name;
                            data.surname = surname;
                            navigation.navigate("MyProfile", {data: data});
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
                }}
            >
                <Text style={styles.buttonText}>Fast Fill-in(dev)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{marginTop: 70}]} onPress={() => {
                navigation.navigate("MyProfile", {data: data})
            }} >
                <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}