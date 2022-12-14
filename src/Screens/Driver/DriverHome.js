import axios from "axios";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Image,
} from "react-native";
import { styles } from "../../Styles";
import { getUserStatus, getUserToken } from "../../UserContext";
import { API_GATEWAY_PORT, DRIVER_ME_EP, HTTP_STATUS_UNAUTHORIZED,HTTP_STATUS_DOESNT_EXIST, SESSION_EXPIRED_MSG, GENERIC_ERROR_MSG, GATEWAY_URL } from "../../Constants";
import {useIsFocused} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import {FontAwesome, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import DriverFrontpage from "./DriverFrontpage";
import Profile from "./DriverMyProfile";
import Wallet from "./WalletDriver";

const Drawer = createDrawerNavigator();

function tryGetMyProfile(token) {
  return axios.get(GATEWAY_URL + DRIVER_ME_EP, {
    headers: { Authorization: "Bearer " + token },
  });
}

export default function DriverHome({ navigation }) {
  const userStatus = getUserStatus();
  const token = getUserToken();

  const isFocused = useIsFocused();
  const [myProfile, setMyProfile] = useState(null);

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

    const stopSearchingTrips = () => {
      return null;
    }


    useEffect(() => {
        fetchProfile()
        if (isFocused) {
            stopSearchingTrips()
        }
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
                                      <DrawerItem label="Switch to Passenger" onPress={() => userStatus.driverMode.exit()}
                                                  icon={() => <MaterialCommunityIcons name="seat-passenger" size={20} color="black"/>}/>
                                      <DrawerItem label="Log Out" onPress={() => userStatus.signInState.signOut()}
                                                  icon={() => <MaterialIcons name="logout" size={24} color="black"/>}/>
                                  </DrawerContentScrollView>
                              )
                          }}>
            <Drawer.Screen name="Frontpage" component={DriverFrontpage}
                           options={{headerShown: false, drawerIcon:() =>
                                   <MaterialIcons name="house" size={24} color="black"/>
                           }}
            />
            { myProfile ?
                <Drawer.Screen name="Profile" component={Profile}
                               options={{headerShown: false, drawerIcon:() =>
                                       <FontAwesome name="users" size={24} color="black"/>}}
                               initialParams={{data: myProfile}}
                />
                : null }
            {myProfile ?
                <Drawer.Screen name="Wallet" component={Wallet}
                               options={{headerShown: false,  drawerIcon:() =>
                                       <MaterialCommunityIcons name="ethereum" size={24} color="black"/>}}
                               initialParams={{data: myProfile}}
                />
                : null }
        </Drawer.Navigator>
    );
}
