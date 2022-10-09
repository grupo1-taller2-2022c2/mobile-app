import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import { styles } from "./Styles";
import profilePicture from "../assets/user-placeholder.png";
export default function MyProfile({route, navigation}) {
  const {token} = route.params;
  return (
    <View style={styles.myProfile}>
      <Image source={profilePicture} style={{height: 200, width:200, resizeMode: "contain"}}/>
      <Text style={{ color: "#fff", fontSize: 24 }}>Name and Surname</Text>
     
      <TouchableOpacity style={[styles.button,{marginTop: 110}]} onPress={() => {
        navigation.navigate("Home")
      }} >
        <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
      </TouchableOpacity>

      <Text style={{ color: "#fff", fontSize: 24 }}>Got token {token}</Text>
    </View>
  );
}
