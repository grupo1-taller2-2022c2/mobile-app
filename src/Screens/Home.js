import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { styles } from "../Styles";
import { getUserStatus, getUserToken } from "../UserContext";
import { API_GATEWAY_PORT, DRIVER_ME_EP, ME_EP, SESSION_EXPIRED_MSG, GENERIC_ERROR_MSG, GATEWAY_URL, NOTIF_TOKEN_EP } from "../Constants";
import {updateDriverStatus} from "./Utils";
import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import Frontpage from "./Frontpage";
import Profile from "./MyProfile";
import Wallet from "./Wallet";
import SavedLocations from "./SavedLocations";
import DriverRegistration from "./DriverRegister";


const Drawer = createDrawerNavigator();

function tryGetMyProfile(token) {
  return axios.get(GATEWAY_URL + ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

function trySendNotificationsToken(userToken, expoToken) {
  return axios.post(
    GATEWAY_URL + NOTIF_TOKEN_EP,
    {
      token: expoToken,
    },
    { headers: { Authorization: "Bearer " + userToken } }
  );
}

export default function Home({ navigation }) {
  const userStatus = getUserStatus();
  const token = getUserToken();
  const isFocused = useIsFocused();
  const [myProfile, setMyProfile] = useState(null);
  updateDriverStatus(token, userStatus);

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
      fetchProfile()
  }, [isFocused]);

    return (
      <Drawer.Navigator useLegacyImplementation
                        drawerType="front"
                        initialRouteName="Profile"
                        screenOptions={{
                            activeTintColor: '#e91e63',
                            itemStyle: { marginVertical: 10 },
                        }}
                        drawerContent={props => {
                            return (
                                <DrawerContentScrollView {...props}>
                                    <DrawerItemList {...props} />
                                    {userStatus.registeredAsDriver.value?
                                        <DrawerItem label="Switch to Driver mode" onPress={() => userStatus.driverMode.enter()}/>
                                        : null}
                                    <DrawerItem label="Log Out" onPress={() => userStatus.signInState.signOut()} />
                                </DrawerContentScrollView>
                            )
                        }}>
          <Drawer.Screen name="Frontpage" component={Frontpage}
                         options={{headerShown: false}}/>
          { myProfile ?
              <Drawer.Screen name="Profile" component={Profile}
                             options={{headerShown: false}}
                             initialParams={{data: myProfile}}/>
              : null }
          {myProfile ?
              <Drawer.Screen name="Wallet" component={Wallet}
                             options={{headerShown: false}}
                             initialParams={{data: myProfile}}/>
              : null }
          <Drawer.Screen name="Saved Locations" component={SavedLocations}
                         options={{headerShown: false}}/>
          {userStatus.registeredAsDriver.value ? null
              : <Drawer.Screen name="Register As Driver" component={DriverRegistration}
                               options={{headerShown: false}}/>
          }
      </Drawer.Navigator>
  );
}
