import { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Modal, StyleSheet } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";
import { getTimeSendRequestFriend } from "../Services/Helper/common";
import userService from "../Services/Api/userService";
import { Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";

function ModalExpand({ requestFriendData, closeModal }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: 'rgba(0,0,0,0.3)'
        },
        modalView: {
            width: '100%',
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            backgroundColor: "white",
            borderRadius: 5,
            padding: 15,
            paddingVertical: 10,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        }
    });
    return <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => closeModal()}
    >
        <View style={styles.container}>
            <View style={styles.modalView}>
                <View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Feather name="user-x" size={25}
                            style={{ marginTop: 5, flex: 1 }} />
                        <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                            <Text style={{ fontWeight: '700', fontSize: 17 }}>Bạn thấy sao về lời mời kết bạn này</Text>
                            <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>
                                {`${requestFriendData?.username} sẽ không nhận được thông báo.`}
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <MaterialCommunityIcons name="message-alert-outline" size={25}
                            style={{ marginTop: 5, left: -2, flex: 1 }} />
                        <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                            <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Chặn ${requestFriendData?.username}`}</Text>
                            <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>
                                {`${requestFriendData?.username} sẽ không thể nhìn thấy bạn hoặc liên hệ với bạn trên Facebook.`}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    </Modal>
}

export default function RequestFriend({ navigation, data }) {
    const [requestFriendData, setRequestFriendData] = useState(data);
    const [status, setStatus] = useState(undefined);
    const [isShowModalExpand, setIsShowModalExpand] = useState(false);
    const { user } = useSelector(
        (state) => state.auth
    );
    const handleSendRequestFriend = (userId, isAccept) => {
        userService.setAcceptFriend(userId, isAccept).then((result) => {
            if (isAccept === 1) setStatus('Các bạn đã là bạn bè');
            else setStatus('Đã gỡ lời mời');
        }).catch((e) => {
            console.log(e.response.data);
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        })
    }
    useEffect(() => {
        setRequestFriendData(data);
        setStatus(undefined)
    }, [data])
    return <View style={{ width: '100%', paddingVertical: 5, flexDirection: 'row' }}>
        {isShowModalExpand && <ModalExpand requestFriendData={requestFriendData} closeModal={() => setIsShowModalExpand(false)} />}
        <TouchableOpacity onPress={() => {
            console.log(requestFriendData);
            if(requestFriendData?.id != user?.id){
                navigation.navigate("profile", { userId: requestFriendData?.id });
            }
        }}>
            <Image source={
                !requestFriendData?.avatar ? require('../../assets/images/default_avatar.jpg')
                    : { uri: requestFriendData?.avatar }
            } style={{ width: 80, height: 80, borderRadius: 40, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1 }} />
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ fontSize: 17, fontWeight: '600' }}>{requestFriendData?.username}</Text>
                {
                    status === undefined ? <Text style={{ color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{getTimeSendRequestFriend(requestFriendData?.created)}</Text>
                        : <Entypo style={{ top: 0, right: 0 }} onPress={() => setIsShowModalExpand(true)}
                            name="dots-three-horizontal" size={18} color="#626262" />
                }
            </View>
            <View style={{ flexDirection: 'column' }}>
                {status !== undefined
                    ? <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{status}</Text>
                    : <>
                        {requestFriendData?.same_friends > 0 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`${requestFriendData?.same_friends} bạn chung`}</Text>}
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => handleSendRequestFriend(requestFriendData.id, 1)}
                                style={{ backgroundColor: COMMON_COLOR.BLUE_COLOR, flex: 1, padding: 10, marginRight: 3, borderRadius: 5 }}>
                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Chấp nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSendRequestFriend(requestFriendData.id, 0)}
                                style={{ backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, flex: 1, padding: 10, marginLeft: 3, borderRadius: 5 }}>
                                <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
            </View>
        </View>

    </View>
}