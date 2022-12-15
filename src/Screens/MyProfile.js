import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import { styles } from "../Styles";
import profilePicture from "../../assets/user-placeholder.png";
import axios from "axios";
import {GATEWAY_URL, ME_EP, SESSION_EXPIRED_MSG} from "../Constants";
import {useEffect, useState} from "react";
import {getUserStatus, getUserToken} from "../UserContext";
import {useIsFocused} from "@react-navigation/native";

function tryGetMyProfile(token) {
    return axios.get(GATEWAY_URL + ME_EP, {
        headers: { Authorization: "Bearer " + token },
    });
}

export default function MyProfile({route, navigation}) {
    const [data, setMyProfile] = useState(null);
    const userStatus = getUserStatus();
    const token = getUserToken();
    const isFocused = useIsFocused();
    const fetchProfile = () => {
        token
            .value()
            .catch((e) => {
                console.log("Token not found");
                Alert.alert("Something went wrong!");
                userStatus.signInState.signOut();
            })
            .then((token) => {
                return tryGetMyProfile(token);
            })
            .then((response) => {
                setMyProfile(response.data);
            })
            .catch((e) => {
                console.log(e);
                //FIXME: is this truly the only error case?
                Alert.alert(SESSION_EXPIRED_MSG);
                userStatus.signInState.signOut();
            });
    }

    useEffect(() => {
        if (isFocused) {
            fetchProfile()
        }
    }, [isFocused]);

  return (
      <View style={styles.myProfile}>
          {data ?
              <>
          <Image source={{uri: data.photo + "?time=" + new Date()}} style={{height: 200, width:200, resizeMode: "contain"}}/>
          <View style={{marginTop: 20}}>
            <Text style={{ color: "#fff", fontSize: 24 }}>Email Address: {data.email}</Text>
            <Text style={{ color: "#fff", fontSize: 24 }}>Name: {data.username} {data.surname}</Text>
            <Text style={{ color: "#fff", fontSize: 24 }}>Rating: {data.ratings}/5</Text>
          </View>
          <TouchableOpacity style={[styles.button,{marginTop: 70}]} onPress={() => {
            navigation.navigate("EditProfile", {data: data});
          }}>
              <Text style={{ color: "#fff", fontSize: 24 }}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{marginTop: 70}]} onPress={() => {
              navigation.navigate("Home")
          }} >
              <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
          </TouchableOpacity>
              </>  : null }
      </View>
  );
}
