import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";

function SplashComment(){
    return(
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
                <View style={{height: 80, width: 280, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
                <View style={{height: 50, width: 280, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
                <View style={{height: 150, width: 280, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
                <View style={{height: 50, width: 280, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 15}}>
                <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
                <View style={{height: 160, width: 280, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND}}></View>
            </View>
        </View>
    )
}

export default SplashComment;