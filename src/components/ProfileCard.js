import {Image, Text, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import * as React from "react";

export default function ProfileCard(props) {
    const user = props.data.data;
    return (
        <>
            <Image source={{uri: user.photo + "?time=" + new Date()}} style={{height: 200, width:200, resizeMode: "contain", borderRadius:5}}/>
            <View style={{marginTop: 20, alignItems:'center'}}>
                <Text style={{ color: "#fff", fontSize: 40, fontWeight:'bold' }}>{user.username} {user.surname}</Text>
                <Text style={{ color: "#919090", fontSize: 24}}>{user.email}</Text>
                {props.isDriver ?
                    <>
                        <Text style={{ color: "#d2d2d2", fontSize: 30, marginTop: 20 }}>Driving a {user.model}</Text>
                        <Text style={{ color: "#fff", fontSize: 30, marginTop:20, marginBottom:20,
                            height:70, width: 250, borderRadius:10, borderWidth:2, borderColor:'grey',
                            textAlignVertical:'center', textAlign:'center'}}>
                            {user.licence_plate}
                        </Text>
                    </> : null}
                <StarRating style={{marginTop: 20}} rating={user.ratings} starSize={25} onChange={() => null} enableSwiping={false} />
            </View>
        </>
)}