import axios from "axios";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
} from "react-native";
import { styles } from "../../Styles";

export default function DriverHome({ navigation }) {
    return (
        <View style={styles.container}>
            <Text
                style={{ padding: 10, marginTop: 20, color: "#fff", marginBottom: 5 }}
            >
                You have successfully logged in as a Driver! {"\n"}
                We will let you know when a passenger requests a ride!
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("WaitingForTrip");
                }}
            >
                <Text style={styles.buttonText}>Start Driving!</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, {backgroundColor:"yellow"}]}
                onPress={() => {
                    navigation.navigate("DriverRating", {data: {passenger: {username: "John", surname: "Doe", ratings: 4.5}, trip_id: 1}});
                }}
            >
                <Text style={styles.buttonText}>Check out Rating Screen (dev)</Text>
            </TouchableOpacity>
        </View>
    );
}
