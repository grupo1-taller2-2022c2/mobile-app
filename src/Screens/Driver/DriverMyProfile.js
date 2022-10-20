import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    Image
  } from "react-native";
  import { styles } from "../../Styles";
  import profilePicture from "../../../assets/user-placeholder.png";
  export default function DriverMyProfile({route, navigation}) {
    const {data} = route.params;
    return (
      <View style={styles.myProfile}>
        <Image source={profilePicture} style={{height: 200, width:200, resizeMode: "contain"}}/>
        <View style={{marginTop: 20}}>
        <Text style={{ color: "#fff", fontSize: 24 }}>Email Address: {data.email}</Text>
        <Text style={{ color: "#fff", fontSize: 24 }}>Name: {data.username} {data.surname}</Text>
        <Text style={{ color: "#fff", fontSize: 24 }}>Rating: {data.ratings}/5</Text>
        <Text style={{ color: "#fff", fontSize: 24 }}>License Plate: {data.licence_plate}</Text>
        <Text style={{ color: "#fff", fontSize: 24 }}>Vehicle Model: {data.model}</Text>
        </View>
        <TouchableOpacity style={[styles.button,{marginTop: 70}]} onPress={() => {
          navigation.navigate("DriverHome")
        }} >
          <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  