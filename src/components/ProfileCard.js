import {Image, Text, View} from "react-native";
import StarRating from "react-native-star-rating-widget";
import * as React from "react";

export default function ProfileCard(props) {
    const user = props.data.data;
    return ( user?
        <>
            <Image source={{uri: user.photo + (!props.notUpdate? "?time=" + new Date() : "")}} style={{height: 200, width:200, resizeMode: "contain", borderRadius:5}}/>
            <View style={{marginTop: 20, alignItems:'center'}}>
                <Text style={{ color: props.modal? '#000' : "#fff", fontSize: 40, fontWeight:'bold' }}>{user.username} {user.surname}</Text>
                <Text style={{ color: props.modal? '#b7b7b7' : "#919090", fontSize: 24}}>{user.email}</Text>
                {props.isDriver ?
                    <>
                        <Text style={{ color: props.modal? "#919090": "#d2d2d2", fontSize: 30, marginTop: 20 }}>Driving a {user.model}</Text>
                        <Text style={{ color: props.modal? '#000': "#fff", fontSize: 30, marginTop:20, marginBottom:20,
                            height:70, width: 250, borderRadius:10, borderWidth:2, borderColor:'grey',
                            textAlignVertical:'center', textAlign:'center'}}>
                            {user.licence_plate}
                        </Text>
                    </> : null}
                <StarRating style={{marginTop: props.modal? 0:20}} rating={user.ratings} starSize={props.modal? 40:25} onChange={() => null} enableSwiping={false} />
            </View>
        </>
            : null
)}