import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { styles } from "./Styles";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { userStatus, userStatusUpdate } from "./UserContext";

import Home from "./Screens/Home";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import MyProfile from "./Screens/MyProfile";
import Map from "./Screens/Map";
import DriverRegister from "./Screens/Driver/DriverRegister";
import DriverHome from "./Screens/Driver/DriverHome";
import DriverMyProfile from "./Screens/Driver/DriverMyProfile";

export function NavigationStack() {
  const userIsSignedIn = userStatus();
  return (
    <Stack.Navigator>
      {userIsSignedIn.value ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Map"
            component={Map}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverRegistration"
            component={DriverRegister}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverHome"
            component={DriverHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverMyProfile"
            component={DriverMyProfile}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const Stack = createNativeStackNavigator();
