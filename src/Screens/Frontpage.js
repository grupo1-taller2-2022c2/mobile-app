import axios from "axios";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Image,
} from "react-native";
import { styles } from "../Styles";
import passengerMarker from "../../assets/passengerMarker.png";
import * as React from "react";
import {MaterialIcons} from "@expo/vector-icons";


export default function Frontpage({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{position: 'absolute', top: 40, left: 15, height:50, width:50}}
            >
                <MaterialIcons name="menu-open" size={50} color='white'/>
            </TouchableOpacity>
            <Text
                style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
            >
                You have successfully logged in!
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("Map");
                }}
            >
                <Text style={styles.buttonText}>Go to Map!</Text>
            </TouchableOpacity>
        </View>
    );
}
