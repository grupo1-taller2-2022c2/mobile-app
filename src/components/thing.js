import {Text, View} from "react-native";
import StarRating from "react-native-star-rating-widget";


const a = () => (
<View style={{ backgroundColor: 'lightblue', width: '100%', marginTop: 20, flex: 1, flexDirection: 'column',
    justifyContent: 'center', borderRadius: 20}}>

    <View style={{ flex: 1, flexDirection: 'row' }}>
        <Text style={{ backgroundColor: 'red', flex: 1, textAlignVertical: 'center', textAlign: 'center'}}>source</Text>
        <Text style={{ backgroundColor: 'pink', flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>driver</Text>
        <Text style={{ backgroundColor: 'green', flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>price</Text>
    </View>

    <View style={{ flex: 1, flexDirection: 'row',height: `50%` }}>
        <Text style={{ backgroundColor: 'yellow', flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>destiny</Text>
        <Text style={{ backgroundColor: 'lightblue', flex: 1, textAlignVertical: 'center', textAlign: 'center' }}>date</Text>
        <StarRating style={{flex: 1}} rating={3} starSize={25} onChange={() => null} enableSwiping={false} />
    </View>

</View>
)

const b = () => (
    <View style={{
        backgroundColor: '#e6e7e8', width: '100%', marginTop: 20, flex: 1, borderStyle: 'solid', borderRadius: 20,
        flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center'
    }}>
        <View style={{
            width: `50%`, backgroundColor: '#cadcfa', alignItems: 'center',
            justifyContent: 'center', height: '100%', borderRadius: 20, borderStyle: 'solid'
        }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                {source}
            </Text>
        </View>
        <View style={{width: `50%`}}>
            <Text style={{fontSize: 20, marginLeft: 10, color: '#525151'}}>
                {destiny} {price} {driver} {date} {state}
            </Text>
        </View>
    </View>
)