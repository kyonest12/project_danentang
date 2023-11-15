import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Image, ScrollView, ToastAndroid } from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { getTextWithIcon, getTimeUpdateCommentFromUnixTime } from '../../Services/Helper/common';
//import {Picker} from "@react-native-picker/picker";
import ReportModal from "./ReportModal";
import { deletePost } from "../../Redux/postSlice";
import { _getCache } from "../../Services/Helper/common";
import { Paragraph } from "react-native-paper";
import ViewWithIcon from "../ViewWithIcon";
import { useDispatch } from "react-redux";
import { setOriginalData, setDescribed, showEmoji, resetEmojiSlice, setEdit, setImage, setVideo, setVideoSize, setPostID } from "../../Redux/emojiSlice";
import data from "../../Screens/img/emoji";
import axios from "../../setups/custom_axios";

//day la man hinh comment khi khong co internet


export default function DotModal({ closeModal, postData, userID, setReportDot, navigation }) {
    const [isModalVisible, setModalVisible] = useState(true);
    const dispatch = useDispatch();


    const MyDot = ({ postData }) => {

        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "white", borderRadius: 10 }}>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <AntDesign name="pushpin" size={30} color="black" style={{ marginLeft: 20 }}></AntDesign>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Ghim bài viết</Text>
                </View>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <Entypo name="bookmark" size={30} color="black" style={{ marginLeft: 20 }}></Entypo>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Lưu bài viết</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    dispatch(resetEmojiSlice());
                    dispatch(setEdit());
                    dispatch(setPostID(postData.id))
                    dispatch(setDescribed(postData.described));
                    if (postData.state) {
                        let emoji = data.find(x => x.name === postData.state);
                        dispatch(showEmoji({ text: emoji.name, icon: emoji.img }));
                    }
                    if (postData.image) {
                        dispatch(setOriginalData(postData.image));
                        dispatch(setImage());
                    }
                    if (postData.video) {
                        dispatch(setVideo());
                        dispatch(setVideoSize({ videoWidth: postData.video.width, videoHeight: postData.video.height }))
                        dispatch(setOriginalData([postData.video]));
                    }
                    setModalVisible(false); closeModal(false);
                    navigation.navigate("createPost");
                }}>
                    <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                        <Entypo name="edit" size={30} color="black" style={{ marginLeft: 20 }}></Entypo>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Chỉnh sửa bài viết</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert("Chuyển vào thùng rác?", "Các mục trong thùng rác sẽ tự động bị xóa sau 30 ngày. Bạn có thể xóa các mục này khỏi Thùng rác sớm hơn bằng cách đi đến Nhật ký hoạt động trong phần Cài đặt. Nếu bạn đã thêm video trực tiếp vào tin thì video đó sẽ bị gỡ ngay lập tức khỏi tin.", [
                        {
                            text: "Hủy",
                        },
                        {
                            text: "Chuyển",
                            onPress: ()=> {
                                /*await axios.post(`/post/delete_post?&id=${postData.id}`).then(res => {
                                    if(res.message == 'OK'){
                                        ToastAndroid.show("Đã chuyển bài viết vào thùng rác", ToastAndroid.SHORT);
                                    }else{
                                        ToastAndroid.show("Có lỗi xảy ra, vui lòng thử lại sau!", ToastAndroid.SHORT);
                                    }
                                })*/
                                dispatch(deletePost({id: postData.id}));
                                setModalVisible(false); closeModal(false);
                            }
                        }
                    ])     
                    }}
                >
                    <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                        <Ionicons name="ios-trash-bin" size={30} color="black" style={{ marginLeft: 20 }}></Ionicons>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Xóa bài viết</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <MaterialIcons name="notifications-off" size={30} color="black" style={{ marginLeft: 20 }}></MaterialIcons>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Tắt thông báo về bài viết này</Text>
                </View>
            </View>
        );
    }
    const HideMyDot = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "white", borderRadius: 10, height: 100 }}>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <FontAwesome5 name="window-close" size={30} color="black" style={{ marginLeft: 20 }}></FontAwesome5>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Ẩn khỏi trang cá nhân</Text>
                        <Text style={{ fontSize: 15, marginLeft: 5 }}>Bài viết này vẫn có thể xuất hiện ở nơi khác</Text>
                    </View>
                </View>
            </View>
        );
    }
    const FriendDot = ({ setReportDot, setModalVisible, closeModal }) => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "white", borderRadius: 10 }}>
                <TouchableOpacity onPress={() => { }}>
                    <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                        <AntDesign name="pushpin" size={30} color="black" style={{ marginLeft: 20 }}></AntDesign>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Ghim bài viết</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <Entypo name="bookmark" size={30} color="black" style={{ marginLeft: 20 }}></Entypo>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Lưu bài viết</Text>
                </View>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <Ionicons name="ios-copy" size={30} color="black" style={{ marginLeft: 20 }}></Ionicons>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Sao chép liên kết</Text>
                </View>
                <TouchableOpacity onPress={() => { setReportDot(true); setModalVisible(false); closeModal(false); }}>
                    <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                        <MaterialIcons name="report" size={30} color="black" style={{ marginLeft: 20 }}></MaterialIcons>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Báo cáo bài viết</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    const HideFriendDot = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "white", borderRadius: 10, height: 100 }}>
                <View style={{ flexDirection: "row", width: 400, alignItems: "center", marginBottom: 5, marginLeft: 20 }}>
                    <AntDesign name="clockcircle" size={30} color="black" style={{ marginLeft: 20 }}></AntDesign>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 5 }}> Tạm ẩn trong 30 ngày</Text>
                        <Text style={{ fontSize: 15, marginLeft: 5 }}>Tạm thời dừng xem bài viết</Text>
                    </View>
                </View>
            </View>
        );
    }
    const NetworkError = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "white", borderRadius: 10, height: 200, width: 400, }}>
                <Image source={require('../../../assets/images/repair.png')}
                    resizeMode="cover" style={{ width: 100, height: 100 }}
                ></Image>
                <Text style={{ textAlign: "center", width: 300 }}>Đây có thể là do lỗi kỹ thuật mà chúng tôi đang tìm cách khắc phục. Hãy thử tải lại trang này.</Text>
            </View>
        );
    }

    //check internet
    const [isConnected, setConnected] = useState(false);
    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener(state => {
            setConnected(state.isConnected);
        });
        // Unsubscribe
        return () => {
            unsubscribe();
        };
    }, [])

    const [h, setH] = useState(400);//chieu cao khi cuon
    return (
        <View style={{ justifyContent: "flex-end" }}>
            <Modal
                style={{ margin: 0 }}
                isVisible={isModalVisible}
                swipeDirection="down"
                swipeThreshold={300}
                onSwipeComplete={(e) => { setModalVisible(false); closeModal(false); }}
            >

                <View style={styles.container}>
                    <View style={styles.modalView}>
                        <View style={styles.grabber}></View>


                        {/* thanh comment */}
                        <View style={styles.comment}>


                            <ScrollView
                                onScroll={(e) => {

                                    //paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                                    if (e.nativeEvent.contentOffset.y >= h) {
                                        setH(h + 400);
                                    }
                                }}
                            >
                                {/* check xem co internet ko, neu co=>comment, ko thi man hinh error */}
                                {!isConnected ? <NetworkError /> : null}
                                {(postData?.author?.id == userID && isConnected) ? <MyDot postData={postData} /> : <FriendDot setReportDot={setReportDot} setModalVisible={setModalVisible} closeModal={closeModal} />}
                                {(postData?.author?.id == userID && isConnected) ? <HideMyDot /> : <HideFriendDot />}

                            </ScrollView>
                        </View>
                    </View>
                </View>

            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "flex-end",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    modalView: {
        width: '100%',
        height: '45%',
        marginTop: 5,
        backgroundColor: "rgb(240,242,245)",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 100,
        alignItems: "center"

    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        textAlign: "center"
    },

    like: {
        flex: 1,
        flexDirection: "row",

    },
    phuhopnhat: {

        flex: 1,
        flexDirection: "row",

    },
    comment: {

        flex: 10
    },
    binhluan: {
        flex: 1.25,
        borderTopWidth: 1.5,
        borderTopColor: '#d2d2d2'
    },
    input: {
        fontSize: 22,
        height: '80%',
        backgroundColor: '#f1f2f4',
        marginTop: 5,
        borderRadius: 25,
        paddingLeft: 10
    },
    touchable: {
        flexDirection: "row",
        flex: 7
    },


    //phan danh cho phan tu comment
    commentContainer: {
        width: '100%',
        marginTop: 5,
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#000",
        flexDirection: "row",
        marginTop: -8
    },
    image: {
        width: 40,
        height: 40,
        backgroundColor: '#ffd480',
        borderRadius: 100
    },
    commentComponent: {
        borderRadius: 15,
        backgroundColor: '#f1f2f6',
        marginLeft: 5,
        marginRight: 30,
        width: 'auto',
        padding: 10
    },
    grabber: {
        width: 100,
        height: 5,
        backgroundColor: "#aaa",
        borderRadius: 2,
        marginBottom: 1,
    },

});