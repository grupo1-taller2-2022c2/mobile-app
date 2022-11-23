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
import { getUserStatus, userStatusUpdate } from "./UserContext";

import Home from "./Screens/Home";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import MyProfile from "./Screens/MyProfile";
import Map from "./Screens/Map";
import DriverRegister from "./Screens/DriverRegister";
import DriverHome from "./Screens/Driver/DriverHome";
import DriverMyProfile from "./Screens/Driver/DriverMyProfile";
import WaitingForDriver from "./Screens/WaitingForDriver";
import WaitingForTripToEnd from "./Screens/WaitingForTripToEnd";
import RateTrip from "./Screens/RateTrip";
import WaitingForTrip from "./Screens/Driver/WaitingForTrip";
import TripOfferReceived from "./Screens/Driver/TripOfferReceived";
import PreTrip from "./Screens/Driver/PreTrip";
import DriverTrip from "./Screens/Driver/DriverTrip";
import DriverRating from "./Screens/Driver/DriverRating";

export function NavigationStack() {
  const userStatus = getUserStatus();
  return (
    <Stack.Navigator>
      {userStatus.signInState.value ? (
        userStatus.driverMode.value ? (
          <>
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
            <Stack.Screen
              name="WaitingForTrip"
              component={WaitingForTrip}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TripOfferReceived"
              component={TripOfferReceived}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PreTrip"
              component={PreTrip}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverTrip"
              component={DriverTrip}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverRating"
              component={DriverRating}
              options={{ headerShown: false }}
            />
          </>
        ) : (
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
              name="WaitingForDriver"
              component={WaitingForDriver}
              options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WaitingForTripToEnd"
                component={WaitingForTripToEnd}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RateTrip"
                component={RateTrip}
                options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DriverRegistration"
              component={DriverRegister}
              options={{ headerShown: false }}
            />
          </>
        )
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
