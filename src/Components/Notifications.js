import { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Modal, StyleSheet, Dimensions } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";
import { getTimeAcceptFriend } from "../Services/Helper/common";
import userService from "../Services/Api/userService";
import { Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { notiTimeDifference } from '../Services/Helper/common';
export default function Notifications({ navigation, data, updateListNoti }) {
    const [notiData, setNotiData] = useState(data);
    const { user } = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        setNotiData(data);
    }, [data]);
    
    let contentToRender;

  switch (data.type) {
    case "1":
        contentToRender = "đã gửi lời mời kết bạn";
        break;
    case "2":
        contentToRender = "đã chấp nhận lời mời kết bạn";
        break;
    case "3":
        contentToRender = "đã thêm bài viết mới";
        break;
    case "4":
        contentToRender = "đã cập nhật bài viết";
        break;
    case "5":
        contentToRender = "đã thả cảm xúc cho bài viết của bạn";
        break;
    case "6":
        contentToRender = "đã gắn mark cho bài viết của bạn";
        break;
    case "7":
        contentToRender = "đã bình luận mark";
        break;
    case "8":
        contentToRender = "đã thêm một video mới";
        break;
    case "9":
        contentToRender = "đã bình luận bài viết";
        break;
  }

    return <View style={{ width: '80%', paddingVertical: 5, flexDirection: 'row' }}>
        <Image source={
                !notiData?.user.avatar ? require('../../assets/images/default_avatar.jpg')
                    : { uri: notiData?.user.avatar }
        } style={{ width: 80, height: 80, borderRadius: 40, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1 }} />
        <View style={styles.noti}> 
            <Text> <Text style={{ fontWeight: 'bold' }}> {notiData?.user.username} </Text> {contentToRender} </Text>
            <Text style={{ fontSize: 10 }}> {notiTimeDifference(notiData?.created)} </Text>
        </View>
    </View> 
}

const styles = StyleSheet.create({
    noti: {
        width: '80%',
        padding: 5,
        marginLeft: 10,
    },
});
