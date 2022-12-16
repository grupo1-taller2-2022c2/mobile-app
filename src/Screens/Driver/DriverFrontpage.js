import axios from "axios";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button, Image, FlatList,
} from "react-native";
import { styles } from "../../Styles";
import {MaterialIcons} from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import {getUserStatus, getUserToken} from "../../UserContext";
import {GATEWAY_URL, TRIPS_HISTORY} from "../../Constants";
import TripSearch from "../../../assets/tripSearch.png";
import {useEffect, useState} from "react";



const HistoryItem = ({source, destiny, price, driver, date, rating, state}) => {
    if (state !== 'Completed' && state !== 'Denied') {
        return null
    }
    const completedTrip = (state === 'Completed');
    return (
        <View style={{ backgroundColor: '#e6e7e8', width: '100%', marginTop: 20, flex: 1, flexDirection: 'column',
            justifyContent: 'center', borderRadius: 10}}>
            <View style={{ flex: 1, flexDirection: 'row', height: `50%`, width: '100%', left:0}}>
                <Text style={{width: '50%', backgroundColor: completedTrip? "#a2c1fa": "#ef7d7d", textAlignVertical: 'top', textAlign: 'center',
                    fontSize:18, borderTopLeftRadius: 10}}>From{'\n'}
                    <Text style={{fontWeight: 'bold'}}>{source}</Text>
                </Text>
                <Text style={{width: '50%',  backgroundColor: completedTrip? "#8eb2f5": "#ea6767", textAlignVertical: 'top', textAlign: 'center',
                    fontSize:18, borderTopRightRadius: 10}}>To{'\n'}
                    <Text style={{fontWeight: 'bold'}}>{destiny}</Text>
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', height: `50%`, width: '100%', marginTop:10}}>
                <Text style={{width: '50%', textAlignVertical: 'center', textAlign: 'center' }}>{completedTrip? 'You drove': 'You denied'}{'\n'}
                    <Text style={{fontWeight:'bold'}}>
                        {driver}
                    </Text>
                </Text>
                {completedTrip ?
                    <View style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}>
                        <StarRating rating={rating} starSize={17} color="#518af1" onChange={() => null}
                                    enableSwiping={false}/>
                    </View> :
                    <Text style={{width: '50%', color: "#95959d", textAlignVertical: 'center', textAlign: 'center'}}>
                        no rating
                    </Text>
                }
            </View>
            <View style={{ flex: 1, flexDirection: 'row', height: `50%`, width: '100%', marginTop:10}}>
                <Text style={{width: '50%', color: "#95959d", textAlignVertical: 'center', textAlign: 'left' }}> {date}</Text>
                <Text style={{width: '50%', color: completedTrip? "#518af1": "#9a3131", textAlignVertical: 'center', textAlign: 'right'}}>{price.slice(0,8)}ETH </Text>
            </View>
        </View>
    )
}


export default function Frontpage({ navigation }) {
    const [driveHistory, updateDriveHistory] = useState([]);

    const userStatus = getUserStatus();
    const token = getUserToken();

    const refreshHistory = () => {
        token.value().then(
            (userToken) => {
                axios
                    .get(GATEWAY_URL + TRIPS_HISTORY + "?user_type=driver", {
                        headers: {Authorization: 'Bearer ' + userToken}
                    })
                    .then((response) => {
                        updateDriveHistory(response.data);
                    })
                    .catch((e) => {
                        Alert.alert(`Couldn't fetch saved history. Try again later`, `Error ${e.response.status}: ${e.message}`);
                    });
            }).catch((e) => {
            console.log("Token not found");
            Alert.alert("Something went wrong!");
            userStatus.signInState.signOut();
        })
    };

    const renderHistory = (drive) => {
        console.log(drive.item)
        return <HistoryItem
            source={drive.item.src_address + " " + drive.item.src_number}
            destiny={drive.item.dst_address + " " + drive.item.dst_number}
            price={drive.item.price + "ETH"}
            driver={drive.item.info.username + ' ' + drive.item.info.surname}
            date={drive.item.date}
            rating={drive.item.info.ratings}
            state={drive.item.state}
        />
    };

    useEffect(refreshHistory, []);

    return (
        <View style={[styles.container, {alignItems: 'center'}]}>
            <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{position: 'absolute', top: 40, left: 15, height:50, width:50}}
            >
                <MaterialIcons name="menu-open" size={50} color='white'/>
            </TouchableOpacity>
            <Text
                style={{ padding: 10, marginTop: 20, textAlign: 'center', fontSize:30, color: "#fff", marginBottom: 5 }}
            >
                Welcome back!
            </Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("WaitingForTrip");
                }}
            >
                <Image source={TripSearch} style={{height: 400, width:400, resizeMode: "contain", borderRadius:5}}/>
            </TouchableOpacity>
            <View style={{borderWidth: 2, borderRadius:40, marginBottom:40, borderColor: "grey", height: 300, width: 400,
                alignItems: "center", justifyContent: "center"}}>
                <View style={{ marginTop:50, marginBottom:50, alignItems: "center", justifyContent: "center", height: 250,
                    width: 330}}>
                    <FlatList
                        data={driveHistory}
                        renderItem={renderHistory}
                        ListEmptyComponent={
                            <Text style={{color: 'grey'}}>You haven't made any trips yet!</Text>
                        }
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </View>
    );
}