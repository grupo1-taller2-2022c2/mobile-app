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
import ethLogo from "../../../assets/eth_logo.png";
import loadingGif from "../../../assets/loading-gif.gif";
import { useState, useEffect } from 'react';
import {useWindowDimensions} from 'react-native';
import axios from 'axios';
import {GATEWAY_URL, SIGNIN_EP, USERS_URI, WALLETS_URI, WALLET_WITHDRAWAL_URI} from "../../Constants";
import {getUserToken} from "../../UserContext";
import * as React from "react";
import {NavigationContext} from "@react-navigation/native";

function tryWithdrawFunds(userEmail, externalWallet, amount, userToken) {
    return axios.post(
        GATEWAY_URL + USERS_URI + userEmail + WALLET_WITHDRAWAL_URI,
        {
            user_external_wallet_address: externalWallet,
            amount_in_ethers: amount,
        },
        { headers: { Authorization: "Bearer " + userToken } }
    );
}

export default function WalletDriver({route}) {
    const {data} = route.params;
    const [walletInfo, updateWalletInfo] = useState(null);
    const windowHeight = useWindowDimensions().height;
    const userEmail = data.email;
    const token = getUserToken();
    const navigation = React.useContext(NavigationContext);
    const [externalWallet, setExternalWallet] = useState("");
    const [amount, setAmount] = useState("");
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
                navigation.navigate("DriverHome");
            });
    };
    useEffect(refreshWallet, []);
    return (
        <View style={[styles.container, { minHeight: Math.round(windowHeight), alignItems: "center", justifyContent: "center"}]}>
            <Text style={[styles.title, {marginTop:50, fontSize: 40}]}>Wallet Withdrawal</Text>
            {walletInfo ? (
                <View style={[styles.container, {width: "100%", marginTop:20, alignItems: "center", justifyContent: "center" }]}>
                    <View style={[styles.container, {width: "100%"}]}>
                        <Text style={styles.text}>
                            Enter wallet and amount to withdraw:
                        </Text>
                        <TextInput
                        style={styles.input}
                            onChangeText={setExternalWallet}
                            value={externalWallet}
                            placeholder="Wallet"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setAmount}
                            value={amount}
                            placeholder="0.0"
                            keyboardType={"number-pad"}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                updateWalletInfo(null);
                                console.log(externalWallet);
                                console.log(amount);
                                tryWithdrawFunds(userEmail, externalWallet, amount, token)
                                    .then((response) => {
                                        Alert.alert("Successful withdrawal!");
                                        refreshWallet();
                                    })
                                    .catch((e) => {
                                        const errCode = (e.response.data.detail)? JSON.parse(e.response.data.detail).code : "unexpectedError";
                                        console.log(e.response.data);
                                        if (errCode === "INVALID_ARGUMENT") {
                                            Alert.alert(`The wallet ${externalWallet} does not exist!`, `You just threw your coins away!`);
                                        } else if (errCode === "INSUFFICIENT_FUNDS") {
                                            Alert.alert("Not enough funds!", "Remember ETH transactions have gas prices!");
                                        } else if (errCode === "UNPREDICTABLE_GAS_LIMIT") {
                                            Alert.alert("Couldn't predict gas limit", "Maybe try a lower withdrawal!");
                                        } else {
                                            Alert.alert(`Unexpected error code: ${e.response.status}`, `${e.response.data.message}`);
                                        }
                                        refreshWallet();
                                    });
                            }}
                        >
                            <Text style={{color: "#fff", fontSize: 18}}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop:50, marginBottom:50, alignItems: "center", justifyContent: "center", height: 300,
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
            <TouchableOpacity style={[styles.button,{marginTop: 10, marginBottom:50}]} onPress={() => {
                navigation.navigate("DriverHome")
            }} >
                <Text style={{ color: "#fff", fontSize: 24 }}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}