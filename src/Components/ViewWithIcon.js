import React, { useEffect, useState, memo, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import { icon_no_code, data_icon_no_code } from '../Services/Helper/emoticons';
import { getTextWithIcon } from '../Services/Helper/common';
import { Paragraph } from 'react-native-paper'
//trungtt123
// value cần phải qua function getTextWithIcon
function ViewWithIcon({ value, styleText, styleIcon }) {
    const [viewElm, setViewElm] = useState();
    //xử lý icon sử dụng icon sử dụng ảnh
    const convertStringToListTextAndImage = useCallback((value) => {
        let newText = value.trim();
        let data = [];
        let dataTmp = newText.split("\n");
        for (let i = 0; i < dataTmp.length; i++) {
            let arr = dataTmp[i].split(" ");
            for (let j = 0; j < arr.length; j++) {
                data.push(arr[j]);
                data.push(" ");
            }
            data.push("\n");
        }
        while (data[0] === "\n" || data[0] === " ") {
            data.splice(0, 1);
        }
        while (data[data.length - 1] === "\n" || data[data.length - 1] === " ") {
            data.splice(data.length - 1, 1);
        }
        let newData = [];
        let text = "";
        for (let i = 0; i < data.length; i++){
            if (data_icon_no_code[data[i]] === undefined){
                text += data[i];
            }
            else {
                newData.push(text);
                newData.push(data[i]);
                text = "";
            }
        }
        if (text !== "") newData.push(text);
        let elm = newData.map((item, index) => {
            if (data_icon_no_code[item] === undefined) {
                return <Text style={styleText} key={index}>{item}</Text>
            }
            else {
                return <Text key={index}><Image style={styleIcon}  source={{ uri: data_icon_no_code[item] }} /> </Text>
            }
        });
        setViewElm(elm);
    }, []);
    useEffect(() => {
        convertStringToListTextAndImage(value);
    }, [value]);
    return (
        <Paragraph>
            {viewElm}
        </Paragraph>
    );
}

export default memo(ViewWithIcon);
