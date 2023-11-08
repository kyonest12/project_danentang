import React, { useEffect, useState, memo } from "react";
import { Image, Dimensions, View, TouchableOpacity } from "react-native";

function ScaledImage(props) {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const widthLayout = Dimensions.get('window').width;
    useEffect(() => {
        Image.getSize(props.uri, (width, height) => {
            const ratio = height / width;
            setWidth(widthLayout);
            setHeight(widthLayout * ratio);
        });
    }, [])
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => props.onPress()}>
            <Image
                
                source={{ uri: props.uri }}
                style={{ height: height, width: width }}
            />
        </TouchableOpacity>
    );
}
export default memo(ScaledImage)