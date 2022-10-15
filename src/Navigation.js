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
  </Stack.Navigator>);
}

const Stack = createNativeStackNavigator();
