import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { getTextWithIcon, getTimeUpdateCommentFromUnixTime } from '../../Services/Helper/common';
//import {Picker} from "@react-native-picker/picker";

import { Audio } from "expo-av";
import axios from "../../setups/custom_axios";
import { _getCache } from "../../Services/Helper/common";
import { Paragraph } from "react-native-paper";
import ViewWithIcon from "../ViewWithIcon";

//đây là mỗi phần tử comment, có urlImage, ten và textComment, time
function ComponentComment(props) {

    return (
        <View style={styles.commentContainer}>
            <Image
                style={styles.image}
                source={{
                    uri: props?.urlImage,
                }}
            />

            <View >
                {/* //comment text */}
                <View style={styles.commentComponent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{props?.name}</Text>
                    <View>
                        <ViewWithIcon value={props?.textComment}
                            styleText={{ fontSize: 17 }}
                            styleIcon={{ width: 17, height: 17 }} />
                    </View>

                </View>

                {/* //time+like+réponse */}
                <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginRight: 13 }}>{props?.time}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginRight: 13 }}>Thích</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766' }}>Phản hồi</Text>

                    {/* số like comment */}

                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginLeft: 20, marginRight: 2 }}>1</Text>
                    <View style={{ width: 16, height: 16, backgroundColor: 'red', marginTop: 2, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                        <Ionicons style={{}} name="heart" size={12} color="white" />
                    </View>


                </View>
            </View>


        </View>
    );
}



//day la man hinh comment khi khong co internet
const NetworkError = () => {

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 120 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={120} color={'#cfd0d1'} ></Ionicons>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Viết bình luận trong khi offline</Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Ionicons name="refresh-outline" size={20} color={'#4c4c4c'} ></Ionicons>
                <Text style={{ fontSize: 15 }}>Nhấn để tải lại bình luận</Text>
            </View>
        </View>
    );
}

export default function CommentModal({ navigation, closeModal, postId, postUpdated }) {
    const [isModalVisible, setModalVisible] = useState(true);
    const [pickerValue, setPickerValue] = useState("Phù hợp nhất");
    const [textComment, setTextComment] = useState("");
    const [like, setLike] = useState("like2");
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const index = useRef(10);
    //goi api lay ra thong tin cac comment cua bai viet co post_id
    const setComment = async (postId) => {
        const textCommentTmp = textComment + " ";
        await axios.post(`/comment/set_comment?id=${postId}&comment=${getTextWithIcon(textCommentTmp)}&index=0&count=10`);
        setTextComment("");
        getComment(postId);
        postUpdated();
    };
    const getComment = async (postId) => {
        if (isLoading) return;
        setIsLoading(true);
        const listComment = await axios.post(`/comment/get_comment?id=${postId}&index=0&count=${index.current}`);
        setComments(listComment.data);
        setIsLoading(false);

    }
    //hàm này gọi khi mở modal comment lên
    const onScreenLoad = async () => {
        await getComment(postId);
    }
    //hàm này gọi khi load tiep comment
    const onLoadComment = async () => {
        index.current = index.current + 10;
        await getComment(postId);
    }
    const handleLikeSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../../../assets/like_sound.mp3'), { shouldPlay: true });
            await sound.playAsync();
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        onScreenLoad();
    }, [])

    //check internet
    const [isConnected, setConnected] = useState(false);
    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            setConnected(state.isConnected);
        });
        // Unsubscribe
        return () => {
            unsubscribe();
        };
    }, [])

    const [h, setH] = useState(400);//chieu cao khi cuon
    return (
        <View>
            <Modal
                style={{ margin: 0 }}
                isVisible={isModalVisible}
                swipeDirection="down"
                swipeThreshold={300}
                onSwipeComplete={(e) => { setModalVisible(false); closeModal(false) }}
            >

                <View style={styles.container}>
                    <View style={styles.modalView}>

                        {/* thanh like */}
                        <View style={styles.like}>
                            <TouchableOpacity
                                style={styles.touchable}
                                onPress={() => console.log("Show nguoi like")}
                            >
                                {/* <Ionicons style={{marginTop: 3}} name="thumbs-up" size={23} color="#1e90ff" /> */}
                                <View style={{ width: 16, height: 16, backgroundColor: '#1f65ed', marginTop: 9, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                                    <Ionicons style={{}} name="thumbs-up" size={12} color="white" />
                                </View>
                                <View style={{ width: 16, height: 16, backgroundColor: 'red', marginTop: 9, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                                    <Ionicons style={{}} name="heart" size={12} color="white" />
                                </View>
                                {/* <Text style={{fontSize: 20, fontWeight: "bold", color: 'black', marginTop: 3}}> 1.234</Text> */}
                                <Ionicons style={{}} name="chevron-forward-outline" size={33} color="black" />
                            </TouchableOpacity>

                            <AntDesign name={like} size={22} color={'#216fdb'} onPress={() => { if (like == "like1") setLike("like2"); else setLike("like1"); handleLikeSound(); }} />
                        </View>

                        {/* thanh phù hợp nhất */}
                        <View style={styles.phuhopnhat}>
                            <Text style={{ fontSize: 20, marginTop: -5 }}>Phù hợp nhất</Text>
                            <Ionicons style={{ flex: 1, alignItems: "flex-end", border: 1 }} name="chevron-down-outline" size={23} color="black" onPress={() => console.log("Click like")} />
                        </View>

                        {/* thanh comment */}
                        <View style={styles.comment}>


                            {isConnected ? <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={comments}
                                renderItem={(data) => {
                                    const item = data.item;
                                    if (item.is_blocked == 0)
                                            return <ComponentComment time={getTimeUpdateCommentFromUnixTime(item.created)} urlImage={item.poster.avatar} key={data.index} name={item.poster.name} textComment={item.comment} />
                                }}
                                // Performance settings
                                removeClippedSubviews={true} // Unmount components when outside of window 
                                initialNumToRender={1} // Reduce initial render amount
                                maxToRenderPerBatch={1} // Reduce number in each render batch
                                updateCellsBatchingPeriod={100} // Increase time between renders
                                windowSize={7} // Reduce the window size
                                onScrollBeginDrag={() => endScroll.current = false}
                                onScrollEndDrag={() => endScroll.current = true}
                                onScroll={(e) => {
                                    //paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                                    if (e.nativeEvent.contentOffset.y >= h) {
                                        //console.log("Load comment ");
                                        onLoadComment();
                                        setH(h + 400);
                                    }
                                }}
                                scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
                            
                            />
                            : <NetworkError />}
                        </View>

                        {/* thanh viết bình luận */}
                        <View style={styles.binhluan}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => { setTextComment(text); }}
                                value={getTextWithIcon(textComment)}
                                placeholder=" Viết bình luận..."
                                keyboardType="default"
                                onSubmitEditing={async () => { await setComment(postId); }}
                            />
                        </View>
                    </View>
                </View>

            </Modal>
        </View>
        // <Modal
        //     animationType="slide"
        //     transparent={true}
        //     visible={modalVisible}
        // >

        // </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "flex-end",
        alignItems: "center",
    },
    modalView: {
        width: '100%',
        height: '100%',
        marginTop: 5,
        backgroundColor: "white",
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
    }

});