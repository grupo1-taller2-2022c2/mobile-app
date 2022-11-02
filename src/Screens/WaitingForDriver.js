import loadingGif from "../../assets/loading-gif.gif";
import { styles } from "../Styles";

import {
    Text,
    View,
    Image
  } from "react-native";
  
export default function WaitingForDriver({route}){
    let data = route.params;
    return (<View style={[styles.container, {alignItems:'center'}]}>
    <Image source={loadingGif} style={{height: 200, width:200, resizeMode: "contain"}}/>
    <Text style={[styles.text,{margin:30, fontSize:30}]}>Driver is on the way! {"\n"}You will be notified at their arrival</Text>
    <Text style={[styles.text,{margin:30, fontSize:20}]}>{data.assignedDriver} is your assigned Driver!</Text>
    </View>)
}