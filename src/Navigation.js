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

import Home from "./Home";
import Login from "./Login";
import Register from "./Register"

export function NavigationStack() {
    return (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
      );
}

const Stack = createNativeStackNavigator();

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Login navigation={navigation} />
    </View>
  );
};

const HomeScreen = ({ route, navigation }) => {
  const {setIsSignedIn} = route.params;
  return (
  <View style={styles.container}>
    <Home setIsSignedIn={setIsSignedIn} navigation={navigation}/>
  </View>)
};

const RegisterScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Register navigation={navigation} />
      </View>
    );
  };