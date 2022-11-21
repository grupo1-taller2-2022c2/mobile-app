import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { styles } from "../../Styles";
import * as Location from "expo-location";

export default function PreTrip() {
  const context = mapContext();
  const userStatus = getUserStatus();
  const token = getUserToken();
  const navigation = React.useContext(NavigationContext);

  //get user location
  let { userLocation } = context.values;
  let { setUserLocation, setUserAddress } = context.setters;
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserAddress(addresses[0]);
    })();
  }, []);

  let {
    userLocation,
    destinationCoords,
    tripModalVisible,
    destinationInput,
    userAddress,
    tripID,
  } = context.values;

  return (
    <View style={styles.myProfile}>
      <Text style={{ color: "#fff", fontSize: 24 }}>Welcome to pre trip</Text>
    </View>
  );
}
