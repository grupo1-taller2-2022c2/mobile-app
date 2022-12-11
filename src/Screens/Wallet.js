import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    Image
} from "react-native";
import { styles } from "../Styles";
import ethLogo from "../../assets/eth_logo.png";
import loadingGif from "../../assets/loading-gif.gif";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {GATEWAY_URL, USERS_URI, WALLETS_URI} from "../Constants";
import {getUserToken} from "../UserContext";
import * as React from "react";
import {NavigationContext} from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';


export default function Wallet({route}) {
    const {data} = route.params;
    const [walletInfo, updateWalletInfo] = useState(null);
    const userEmail = data.email;
    const token = getUserToken();
    const navigation = React.useContext(NavigationContext);
    const refreshWallet = () => {
        axios
            .get(GATEWAY_URL + USERS_URI + userEmail + WALLETS_URI, {
                headers: {Authorization: 'Bearer ' + token }
            })
            .then((response) => {
                updateWalletInfo(response.data);
            })
            .catch((e) => {
                    Alert.alert(`Couldn't fetch wallet information. Try again later. Error ${e.response.status}: ${e.message}`);
                    navigation.navigate("Home");
            });
    };
    useEffect(refreshWallet, []);
    return (
        <View style={[styles.container, { alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.title, {marginTop:50, fontSize:40}]}>Wallet Balance</Text>
            {walletInfo ? (
                <View style={[styles.container, {marginTop:0, marginBottom:0, alignItems: "center", justifyContent: "center" }]}>
                    <View style={{marginTop: 0}}>
                        <Text style={{ color: "#fff", fontSize: 24 }}>
                            To increase your funds, transfer to this wallet:
                        </Text>
                        <Text onPress={async () => {
                                const status = await Clipboard.setStringAsync(walletInfo.address);
                                if (status === true) {
                                    Alert.alert("Copied to clipboard!");
                                }
                            }
                            }
                            style={{ marginTop: 10, color: "#1db73f", fontSize: 30, textDecorationLine: "underline" }}>
                            {walletInfo.address}
                        </Text>
                    </View>
                    <View style={{ marginTop:80, marginBottom:30, alignItems: "center", justifyContent: "center", height: 300,
                        width: 400, borderWidth: 2, borderRadius:40, borderColor: "grey" }}>
                        <Image source={ethLogo} style={{height: 50, width:50, resizeMode: "contain"}}/>
                        <Text style={{ color: "#fff", fontSize: 50}}>
                            {walletInfo.balance}{
                            <Text style={{ color: "#8890f3", fontSize: 50}}>ETH</Text>
                        }
                        </Text>
                        <TouchableOpacity style={[styles.button,{marginTop: 20}]} onPress={() => {
                            updateWalletInfo(null);
                            refreshWallet();
                        }} >
                            <Text style={{ color: "#fff", fontSize: 24 }}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Image
                    source={loadingGif}
                    style={{ height: 200, width: 200, resizeMode: "contain", marginTop: 100, marginBottom:100 }}
                />
            )}
            <TouchableOpacity style={[styles.button,{marginTop: 0, marginBottom:50}]} onPress={() => {
                navigation.navigate("Home")
            }} >
                <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}