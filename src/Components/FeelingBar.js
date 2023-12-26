import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { View } from "react-native";


export default function FeelingBar({postId, typeFeel, type}){
    return <View style={{flexDirection: 'row'}}>
        <Ionicons style={{ top: 2, marginLeft: 5 }} name="happy-sharp" size={22} color="#6BB7EC" />
        <Ionicons style={{ top: 2, marginLeft: 8, marginRight: 8 }} name="sad-sharp" size={22} color="#FFC0CB" />
    </View>
}