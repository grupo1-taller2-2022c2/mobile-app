import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { styles } from "./Styles";
import { userStatus, userStatusUpdate } from "./UserContext";


export default function Home() {
  const setSignInStatus = userStatusUpdate();
  return (
    <View style={styles.container}>
      <Text
        style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
      >
        You have succesfully logged in!
      </Text>
      <Button
        title="Logout"
        onPress={() => {
          setSignInStatus(false);
        }}
      ></Button>
    </View>
  );
}
