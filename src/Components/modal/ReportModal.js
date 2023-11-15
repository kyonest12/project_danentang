import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList, ToastAndroid } from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { getTextWithIcon, getTimeUpdateCommentFromUnixTime } from '../../Services/Helper/common';
//import {Picker} from "@react-native-picker/picker";


import axios from "../../setups/custom_axios";
import postService from "../../Services/Api/postService";
import { _getCache } from "../../Services/Helper/common";
import { Paragraph } from "react-native-paper";
import ViewWithIcon from "../ViewWithIcon";


const ReportList = ({postID}) => {


    const subjectArray = {
        'Ảnh khỏa thân': ['Ảnh khỏa thân người lớn', 'Gợi dục', 'Hoạt động tình dục', 'Bóc lột tình dục', 'Dịch vụ tình dục', 'Liên quan đến trẻ em', 'Chia sẻ hình ảnh riêng tư'],
        'Bạo lực': ['Hình ảnh bạo lực', 'Tử vong hoặc bị thương nặng', 'Mối đe dọa bạo lực', 'Ngược đãi động vật', 'Vấn đề khác'],
        'Quấy rồi': ['Tôi', 'Một người bạn'],
        'Tự tử/Tự gây thương tích': ['Tự tử/Tự gây thương tích'],
        'Tin giả': ['Tin giả'],
        'Spam': ['Spam'],
        'Bán hàng trái phép': ['Chất cấm, chất gây nghiện', 'Vũ khí', 'Động vật có nguy cơ bị tuyệt chủng', 'Động vật khác', 'Vấn đề khác'],
        'Ngôn từ gây thù ghét': ['Chủng tộc hoặc sắc tộc', 'Nguồn gốc quốc gia', 'Thành phần tôn giáo', 'Phân chia giai cấp xã hội', 'Thiên hướng tình dục', 'Giới tính hoặc bản dạng giới', 'Tình trạng khuyết tật hoặc bệnh tật', 'Hạng mục khác'],
        'Khủng bố': ['Khủng bố'],

    };
    const ItemReport = ({data, textItem, postID}) => {
        const [textIcon, setTextIcon] = useState(true);
        const reportPost = (data) => {
            postService.reportPost({
                id: data.id,
                subject: data.subject,
                details: data.details,
            }).then(()=> ToastAndroid.show("Báo cáo thành công", ToastAndroid.SHORT)).catch((e)=> {
                console.log(e);
            });
        }
        return (
            <View>
                <TouchableOpacity onPress={() => {setTextIcon(!textIcon)}}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'gray', height: 50 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{textItem}</Text>
                        {textIcon ? <AntDesign name="right" size={20} color="gray" />: <AntDesign name="down" size={20} color="gray" />}
                    </View>
                </TouchableOpacity>
                {!textIcon && <FlatList data={data}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                reportPost({id: postID, subject: textItem, details: item});
                            }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'gray', height: 40 }}>
                                    <Text style={{ fontSize: 15 }}>{item}</Text>
                                    <AntDesign name="right" size={18} color="black" />
                                </View>
                            </TouchableOpacity>
                        );
                    }}>
                </FlatList>}
            </View>
        );
    }
    return (
        <View style={{ flex: 1, height: 500, justifyContent: "flex-start", width: '100%', marginTop: 10 }}>
            <FlatList data={Object.keys(subjectArray)}
                renderItem={({ item }) => {
                    return (
                        <ItemReport data={subjectArray[item]} textItem={item} postID={postID}/>
                    );
                }}>
            </FlatList>
        </View>
    );
}
//day la man hinh comment khi khong co internet

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

export default function ReportModal({ closeModal, postID }) {
    const [isModalVisible, setModalVisible] = useState(true);

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
        <View style={{ justifyContent: "flex-end" }}>
            <Modal
                style={{ margin: 0 }}
                isVisible={isModalVisible}
                swipeDirection="down"
                swipeThreshold={300}
                onSwipeComplete={(e) => { setModalVisible(false); closeModal(false) }}
            >

                <View style={styles.container}>
                    <View style={styles.modalView}>
                        <View style={styles.grabber}></View>
                        <View style={{ flexDirection: 'column', width: '100%', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Hãy chọn vấn đề</Text>
                            <Text style={{ fontSize: 16, color: 'gray' }}>Nếu bạn nhận thấy ai đó gặp nguy hiểm, đừng chần chừ mà hãy tìm ngay sự giúp đỡ trước khi báo cáo với Facebook.</Text>
                        </View>
                        <ReportList postID={postID}/>
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
        height: '95%',
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