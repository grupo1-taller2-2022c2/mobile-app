import axios from 'axios';
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { styles } from "./Styles";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in!
      </Text>
      <Button title='Logout'></Button>
      
    </View>
  );
}

