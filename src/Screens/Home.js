import axios from "axios";
import {
  Text,
  View,
    Image,
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
import {MaterialIcons, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';


const Drawer = createDrawerNavigator();

function tryGetMyProfile(token) {
  return axios.get(GATEWAY_URL + ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
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
                                    <View style={{borderBottomColor: 'grey', borderBottomWidth: 1,
                                    height: 100}}>
                                        {myProfile ?
                                            <Image source={{uri: myProfile.photo + "?time=" + new Date()}}
                                                   style={{height: 60, width:60, resizeMode: "contain", borderColor: "grey",
                                                       position: 'absolute', borderWidth:2, top: 20, left:20}} />
                                            : null}
                                        {myProfile ?
                                            <View style={{height: 60, width:200, position: 'absolute',
                                                          top: 20, right:10, left: 100}}>
                                                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                                    {myProfile.username} {myProfile.surname}
                                                </Text>
                                                <Text style={{fontSize: 14}}>
                                                    {myProfile.email}
                                                </Text>
                                            </View>
                                            : null}
                                    </View>
                                    <DrawerItemList {...props} />
                                    {userStatus.registeredAsDriver.value?
                                        <DrawerItem label="Switch to Driver mode" onPress={() => userStatus.driverMode.enter()}
                                                    icon={() => <FontAwesome name="taxi" size={20} color="black"/>}/>
                                        : null}
                                    <DrawerItem label="Log Out" onPress={() => userStatus.signInState.signOut()}
                                                icon={() => <MaterialIcons name="logout" size={24} color="black"/>}/>
                                </DrawerContentScrollView>
                            )
                        }}>
          <Drawer.Screen name="Frontpage" component={Frontpage}
                         options={{headerShown: false, unmountOnBlur:true, drawerIcon:() =>
                                 <MaterialIcons name="house" size={24} color="black"/>
                         }}
          />
          { myProfile ?
              <Drawer.Screen name="Profile" component={Profile}
                             options={{headerShown: false, unmountOnBlur:true, drawerIcon:() =>
                                     <FontAwesome name="users" size={24} color="black"/>}}
                             initialParams={{data: myProfile}}
              />
              : null }
          {myProfile ?
              <Drawer.Screen name="Wallet" component={Wallet}
                             options={{headerShown: false, unmountOnBlur:true, drawerIcon:() =>
                                     <MaterialCommunityIcons name="ethereum" size={24} color="black"/>}}
                             initialParams={{data: myProfile}}
              />
              : null }
          <Drawer.Screen name="Saved Locations" component={SavedLocations}
                         options={{headerShown: false, drawerIcon:() =>
                                 <FontAwesome name="bookmark" size={30} color="black"/>}}
          />
          {userStatus.registeredAsDriver.value ? null
              : <Drawer.Screen name="Register As Driver" component={DriverRegistration}
                               options={{headerShown: false, drawerIcon:() =>
                                       <FontAwesome name="drivers-license-o" size={24} color="black"/>}}
              />
          }
      </Drawer.Navigator>
  );
}
