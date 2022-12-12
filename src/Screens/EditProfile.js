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
import {EDIT_PROF_EP, GATEWAY_URL, SESSION_EXPIRED_MSG, UPLOAD_PIC_PAS} from "../Constants";
import {getUserStatus, getUserToken} from "../UserContext";

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

function tryUploadPicture(picture, token) {
    const form = new FormData();
    form.append('photo', {name: 'media', uri: picture, type: "image/jpg" });
    return axios.post(GATEWAY_URL + UPLOAD_PIC_PAS,
        form,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + token
        }
    })
}


export default function EditProfile({route, navigation}) {
    const {data} = route.params;
    const [name, onChangeName] = useState(data.username);
    const [surname, onChangeSurname] = useState(data.surname);
    const [image, setImage] = useState(null);

    const token = getUserToken();
    const userStatus = getUserStatus();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontSize: 15 }]}>
                Please, enter your new profile information!
            </Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, resizeMode: "contain"}} />}
                {!image && <Image source={{uri: data.photo + "?time=" + new Date()}} style={{height: 200, width:200, resizeMode: "contain"}}/>}
                <Text>{"\n"}</Text>
                <Button title="Pick an image" onPress={pickImage} />
            </View>
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
                        var imageErrorMessage = ""; // React native me fuerza la mano, porque no permite stackear alerts
                        token
                            .value()
                            .catch((e) => {
                                console.log("Token not found");
                                Alert.alert("Something went wrong!");
                                userStatus.signInState.signOut();
                            })
                            .then((token) => {
                                if (image) {
                                    tryUploadPicture(image.uri, token).catch(
                                        (e) => {
                                            console.log(e);
                                            console.log(e.response.data);
                                            imageErrorMessage = `But we couldn't upload your picture! ERROR ${e.response.status}: ${(e.response.data)? JSON.stringify(e.response.data): "Completely unexpected error" }`
                                        }
                                    )
                                }
                                return tryEditProfile(name, surname, token);
                            })
                            .then(() => {
                                Alert.alert("Successful profile change!", imageErrorMessage);
                                navigation.navigate("Home");
                            })
                            .catch((e) => {
                                console.log(e);
                                //FIXME: is this truly the only error case?
                                Alert.alert(SESSION_EXPIRED_MSG);
                                userStatus.signInState.signOut();
                            });
                        }
            }
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