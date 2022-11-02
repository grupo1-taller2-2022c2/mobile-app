import loadingGif from "../../assets/loading-gif.gif";
import { styles } from "../Styles";

import {
    Text,
    View,
    Image
  } from "react-native";
  
export default function WaitingForDriver({route}){
    let data = route.params;
    let driver = data.assignedDriver
    return (<View style={[styles.container, {alignItems:'center'}]}>
    <Image source={loadingGif} style={{height: 200, width:200, resizeMode: "contain"}}/>
    <Text style={[styles.text,{margin:30, fontSize:30}]}>Driver is on the way! {"\n"}You will be notified at their arrival</Text>
    <Text style={[styles.text,{margin:30, fontSize:20}]}>{driver.username} {driver.surname} is your assigned Driver!</Text>
    <Text style={[styles.text,{margin:30, fontSize:20}]}>And they are driving a {driver.model}, with license plate {driver.licence_plate}</Text>
    <Text style={[styles.text,{margin:30, fontSize:20}]}>Rating for this driver is: {driver.ratings}/5</Text>
    </View>)
}