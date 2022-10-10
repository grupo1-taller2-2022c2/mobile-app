import { NavigationContainer } from "@react-navigation/native";
import { styles } from "./src/Styles";
import { NavigationStack } from "./src/Navigation";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { UserStatusProvider } from "./src/UserContext";

export default function App() {
  return (
    <UserStatusProvider>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </UserStatusProvider>
  );
}
