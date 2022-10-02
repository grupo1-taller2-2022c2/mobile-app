import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { styles } from "./src/Styles";
import {NavigationStack} from "./src/Navigation"
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false) //FIXME: use it for protected routes
  return (
    <NavigationContainer>
      <NavigationStack/>
    </NavigationContainer>
  );
}
