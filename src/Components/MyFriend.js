import { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Modal, StyleSheet, Dimensions } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";
import { getTimeAcceptFriend } from "../Services/Helper/common";
import userService from "../Services/Api/userService";
import { Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";

function ModalExpand({ navigation, friendData, closeModal, updateListFriends, unFriendFisished }) {
    const { user } = useSelector(
        (state) => state.auth
    );
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: 'rgba(0,0,0,0.3)'
        },
        modalView: {
            width: '100%',
            height: '50%',
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 5,
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
    const setBlock = (type) => {
        closeModal();
        Alert.alert(`Chặn ${friendData.username}`, `Những người bạn chặn sẽ không thể gắn thẻ hay mời bạn tham gia nhóm hoặc sự kiện, cũng không thể bắt đầu trò chuyện, thêm bạn vào danh sách bạn bè hoặc xem nội dung bạn đăng trên dòng thời gian của mình nữa. Nếu bạn chặn ai đó khi hai người đang là bạn bè thì hành động này cũng sẽ hủy kết bạn với họ.`,
            [
                { text: "Hủy", onPress: () => null },
                {
                    text: "Chặn", onPress: () => {
                        userService.setBlock(friendData.id, type).then((result) => {
                            console.log(result);
                            updateListFriends();
                        }).catch(e => {
                            //console.log(e.response.data);
                            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                                { text: "OK", onPress: () => null }
                            ]);
                        })
                    }
                }
            ]);

    }
    const unFriend = () => {
        closeModal();
        Alert.alert(`Hủy kết bạn với ${friendData.username}`, `Bạn có chắc chắn muốn hủy kết bạn với ${friendData.username} không.`,
            [
                { text: "Hủy", onPress: () => null },
                {
                    text: "Xác nhận", onPress: () => {
                        userService.unFriend(friendData.id).then((result) => {
                            console.log(result);
                            unFriendFisished(result.data)
                        }).catch(e => {
                            //console.log(e.response.data);
                            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                                { text: "OK", onPress: () => null }
                            ]);
                        })
                    }
                }
            ]);

    }
    return <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => closeModal()}
    >
        <View style={styles.container}>
            <View style={styles.modalView}>
                <TouchableOpacity onPress={() => {
                    if(user?.id != friendData?.id){
                        navigation.navigate("profile", { userId: friendData?.id });
                    }
                }}
                    style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 2, justifyContent: 'center' }}>
                        <Image style={{ width: 60, height: 60, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderRadius: 30, borderWidth: 1 }}
                            source={
                                !friendData.avatar ? require('../../assets/images/default_avatar.jpg')
                                    : { uri: friendData.avatar }}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`${friendData.username}`}</Text>
                        <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`Là bạn bè từ ${getTimeAcceptFriend(friendData.created)}`}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#e7e7e7' }} />
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Ionicons name="chatbubble-ellipses-outline" size={27} />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Nhắn tin cho ${friendData.username}`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Feather name="x-square" size={27} style={{ left: -1 }} />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Bỏ theo dõi ${friendData?.username}`}</Text>
                        <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>
                            {`Không nhìn thấy bài viết của nhau nữa nhưng vẫn là bạn bè.`}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setBlock(0)}
                    style={{ flex: 1, flexDirection: 'row', width: '100%', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <MaterialCommunityIcons name="message-alert-outline" size={27} style={{ left: -1 }} />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9 }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Chặn ${friendData?.username}`}</Text>
                        <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>
                            {`${friendData?.username} sẽ không thể nhìn thấy bạn hoặc liên hệ với bạn trên Facebook.`}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => unFriend()}
                    style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Feather name="user-x" size={28} color="red" />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17, color: 'red' }}>{`Hủy kết bạn với ${friendData?.username}`}</Text>
                        <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>
                            {`Xóa ${friendData?.username} khỏi danh sách bạn bè.`}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>

        </View>
    </Modal>
}

function ModalAcceptFriend({ navigation, friendData, closeModal, acceptFriendFisished }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: 'rgba(0,0,0,0.3)'
        },
        modalView: {
            width: '100%',
            height: 200,
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 5,
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
    const accept = () => {
        userService.setAcceptFriend(friendData.id, 1).then((result) => {
            console.log(result);
            acceptFriendFisished(true);
            closeModal();
        }).catch(e => {
            closeModal();
            //console.log(e.response.data);
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);

        });
    }
    const remove = () => {
        userService.setAcceptFriend(friendData.id, 0).then((result) => {
            console.log(result);
            acceptFriendFisished(false);
            closeModal();
        }).catch(e => {
            closeModal();
            ////console.log(e.response.data);
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        })
    }
    return <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => closeModal()}
    >
        <View style={styles.container}>
            <View style={styles.modalView}>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View
                        style={{ zIndex: 9999, flexDirection: 'column', position: 'absolute', justifyContent: 'center', top: 18, left: 10 }}>
                        <AntDesign onPress={() => closeModal()}
                            name="close" size={25} />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17, textAlign: 'center' }}>{`Trả lời mời mời của ${friendData.username}`}</Text>
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#e7e7e7' }} />
                <TouchableOpacity onPress={() => accept()}
                    style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Feather name="user-check" size={28} />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Chấp nhận lời mời`}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove()}
                    style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 15 }}>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <Feather name="user-x" size={28} />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 9, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 17 }}>{`Xóa lời mời`}</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </View>
    </Modal>
}

export default function MyFriend({ navigation, data, updateListFriends }) {
    const [friendData, setFriendData] = useState(data);
    const [status, setStatus] = useState(undefined);
    const [isShowModalExpand, setIsShowModalExpand] = useState(false);
    const [isShowModalAcceptFriend, setIsShowModalAcceptFriend] = useState(false);
    const [isFriend, setIsFriend] = useState(+data.isFriendStatus === 3);
    const [isFriendStatus, setIsFriendStatus] = useState(+data.isFriendStatus);
    const [action, setAction] = useState(+data.isFriendStatus === 1 ? 1 : 0);
    const { user } = useSelector(
        (state) => state.auth
    );
    const handleSetRequestFriend = () => {
        console.log('suggest', friendData);
        userService.setRequestFriend(friendData.id).then((result) => {
            console.log('data', result.data.requested_friends);
            // setStatus(+result.data.requested_friends);
            if (+result.data.requested_friends === 1) {
                setAction(1);
                setIsFriendStatus(1);
            }
            else if (+result.data.requested_friends === 0) {
                setAction(2);
                setIsFriendStatus(0);
            }
        }).catch((e) => {
            //console.log(e.response.data);
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        })
    }
    const unFriendFisished = (friend) => {
        setFriendData(friend);
        setAction(3);
        setIsFriendStatus(0);
    }
    const handleAcceptFriend = (accept) => {
        console.log('accept', accept)
        if (accept) {
            setAction(4);
            setIsFriendStatus(3);
        }
        else {
            setAction(0);
            setIsFriendStatus(0);
        }
    }
    useEffect(() => {
        setFriendData(data);
        setIsFriendStatus(+data.isFriendStatus);
        setAction(+data.isFriendStatus === 1 ? 1 : 0);
    }, [data])
    console.log('friendData', friendData)
    return <View style={{ width: '100%', paddingVertical: 5, flexDirection: 'row' }}>
        {isShowModalExpand && <ModalExpand navigation={navigation} unFriendFisished={(friend) => unFriendFisished(friend)}
            friendData={friendData} updateListFriends={() => updateListFriends()}
            closeModal={() => setIsShowModalExpand(false)} />}
        {isShowModalAcceptFriend && <ModalAcceptFriend navigation={navigation}
            friendData={friendData} acceptFriendFisished={(accept) => handleAcceptFriend(accept)}
            closeModal={() => setIsShowModalAcceptFriend(false)} />}
        <TouchableOpacity onPress={() => {
            if(user?.id != friendData?.id ){
                navigation.navigate("profile", { userId: friendData?.id });
            }
        }}>
            <Image source={
                !friendData?.avatar ? require('../../assets/images/default_avatar.jpg')
                    : { uri: friendData?.avatar }
            } style={{ width: 80, height: 80, borderRadius: 40, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1 }} />
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>{friendData?.username}</Text>
                    {action === 0 && friendData?.same_friends > 0 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`${friendData?.same_friends} bạn chung`}</Text>}
                    {action === 1 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`Đã gửi lời mời kết bạn`}</Text>}
                    {action === 2 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`Đã hủy lời mời`}</Text>}
                    {action === 3 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`Đã hủy kết bạn`}</Text>}
                    {action === 4 && <Text style={{ marginTop: 2, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>{`Các bạn đã là bạn bè`}</Text>}
                </View>

                {
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        {isFriendStatus === 3 && <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <Entypo style={{ top: 0, right: 0 }} onPress={() => setIsShowModalExpand(true)}
                                name="dots-three-horizontal" size={18} color="#626262" />
                        </View>}
                        {isFriendStatus === 0 && <TouchableOpacity onPress={() => handleSetRequestFriend()}
                            style={{ backgroundColor: COMMON_COLOR.BLUE_COLOR, padding: 10, marginRight: 3, borderRadius: 5 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Thêm bạn bè</Text>
                        </TouchableOpacity>}
                        {isFriendStatus === 1 && <TouchableOpacity onPress={() => handleSetRequestFriend()}
                            style={{ backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, padding: 10, marginRight: 3, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Hủy</Text>
                        </TouchableOpacity>}
                        {isFriendStatus === 2 && <TouchableOpacity onPress={() => setIsShowModalAcceptFriend(true)}
                            style={{ backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, padding: 10, marginRight: 3, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Trả lời</Text>
                        </TouchableOpacity>}
                    </View>
                }
            </View>
        </View>

    </View>
}