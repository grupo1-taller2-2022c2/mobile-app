import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    Image
  } from "react-native";
  import { styles } from "../../Styles";
  import profilePicture from "../../../assets/user-placeholder.png";
import {useEffect, useState} from "react";
import {GATEWAY_URL, DRIVER_ME_EP, SESSION_EXPIRED_MSG} from "../../Constants";
import {getUserStatus, getUserToken} from "../../UserContext";
import {useIsFocused} from "@react-navigation/native";
import axios from "axios";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import ProfileCard from "../../components/ProfileCard"

function tryGetMyProfile(token) {
    return axios.get(GATEWAY_URL + DRIVER_ME_EP, {
        headers: { Authorization: "Bearer " + token },
    });
}

  export default function DriverMyProfile({route, navigation}) {
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
          <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{position: 'absolute', top: 40, left: 15, height:50, width:50}}
          >
              <MaterialIcons name="menu-open" size={50} color='white'/>
          </TouchableOpacity>
          {data ?
              <>
                  <ProfileCard data={{data}} isDriver={true}/>
                  <TouchableOpacity style={{position: 'absolute', top: 40, right: 15, height:50, width:50}} onPress={() => {
                      navigation.navigate("DriverEditProfile", {data: data});
                  }}>
                      <FontAwesome name="edit" size={50} color='white' />
                  </TouchableOpacity>
              </> : null}
      </View>
    );
  }
  