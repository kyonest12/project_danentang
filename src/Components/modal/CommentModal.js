import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList,KeyboardAvoidingView, endScroll  } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { getTextWithIcon} from '../../Services/Helper/common';
//import {Picker} from "@react-native-picker/picker";

import { Audio } from "expo-av";
import axios from "../../setups/custom_axios";
import { _getCache } from "../../Services/Helper/common";
import { IconButton, Paragraph, RadioButton } from "react-native-paper";
import ViewWithIcon from "../ViewWithIcon";
import { formatTimeDifference } from '../../Services/Helper/common';
import postService from "../../Services/Api/postService";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COMMON_COLOR } from "../../Services/Helper/constant";
import { useSelector } from "react-redux";
import SplashComment from "../SplashComment";
//đây là mỗi phần tử comment, có urlImage, ten và textComment, time

function ListFeelComponent({navigation, isVisible, id, closeModal}){

    const [feels, setFeels] = useState([]);
    useEffect(() => {
        postService.getListFeel(id, 0, 20).then((res) => {
            // console.log('res list feel: ', res.data);
            setFeels(res.data);
        }).catch(e => {
            console.log('error list feel: ', e.response);
        })
    }, [])

    return (
        <Modal isVisible={isVisible}>
            <View style={{backgroundColor: '#fff'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{marginLeft: 10, fontWeight: 'bold'}}>Những người bày tỏ cảm xúc</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <IconButton
                            icon={() => <Icon name="times" size={22} color="black" />} // Sử dụng icon "đầu X" từ FontAwesome5
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {feels.length == 0 && (<Text style={{marginLeft: 10, marginBottom: 10}}>Không có người bày tỏ cảm xúc</Text>)}
                    {feels.map((item) => (
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, marginTop: 5}} key={item.id}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                <TouchableOpacity onPress={() => {
                                    // navigation.navigate("profile", { userId: item.feel.user.id });
                                }}>
                                    <Image source={
                                        !item.feel.user.avatar ? require('../../../assets/images/default_avatar.jpg') 
                                            : { uri: item.feel.user.avatar }
                                    } style={{ width: 50, height: 50, borderRadius: 25, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1 }} />
                                </TouchableOpacity>
                                <Text style={{marginLeft: 10}}>{item.feel.user.name}</Text>
                            </View>
                            <View style={{marginRight: 15}}>
                                {item.feel.type != "0" ? (
                                    <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                                ) : (
                                    <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Modal>
    )
}

function ComponentComment(props) {
    const [editing, setEditing] = useState(false);

    // console.log("props: ", props);
    function sendMarkId(id){
        props.callback(id);
    }

    useEffect(() => {
        if(props.checkDoneEdit) setEditing(false);
    }, [props.checkDoneEdit])

    function handleEditComment(){
        setEditing(true);
        props.edit(
            {
                parentId: props.parentId,
                content: props.textComment,
                type: props.type,
                name: props.name
            }
        );
    }


    return (
        <View style={styles.commentContainer}>
            <Image
                style={styles.image}
                source={{
                    uri: props?.urlImage,
                }}
            />

            <View>
                {/* //comment text */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.commentComponent, { marginTop: 0 }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{props?.name}</Text>
                        <View>
                            {
                                !editing && (
                                    <ViewWithIcon value={props?.textComment}
                                    styleText={{ fontSize: 17 }}
                                    styleIcon={{ width: 17, height: 17 }} />
                                )
                            }
                            {
                                editing && (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: 'blue'}}>Bình luận đang chỉnh sửa</Text>
                                        <TouchableOpacity onPress={() => {setEditing(false); props.cancelEdit()}}>
                                            <IconButton
                                                icon={() => <Icon name="times" size={15} color="black" />} // Sử dụng icon "đầu X" từ FontAwesome5
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    {props.isOwner && !editing && props.type != "-1" && (
                        <TouchableOpacity onPress={() => handleEditComment()}>
                            <Icon name="edit" size={20} color="#656766" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* //time+like+response */}
                <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                    <Text style={{ fontSize: 13, color: '#656766', marginRight: 13 }}>{props?.time}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginRight: 13 }}>
                        {props.type == "1" ? "Trust" : (props.type == "0" ? "Fake": " ")}
                    </Text>
                    {props.type != "-1" && (
                        <TouchableOpacity onPress={() => sendMarkId({id: props.markId, name: props.name})}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766' }}> 
                                Phản hồi
                            </Text>
                    </TouchableOpacity>
                    )}

                    {/* số like comment */}

                    {/* <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginLeft: 20, marginRight: 2 }}>1</Text>
                    <View style={{ width: 16, height: 16, marginTop: 2, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                        <Ionicons style={{}} name="happy-outline" size={15} color="#626262" />
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#656766', marginLeft: 20, marginRight: 2 }}>1</Text>
                    <View style={{ width: 16, height: 16, marginTop: 2, borderRadius: 20, paddingTop: 1, alignItems: 'center' }}>
                        <Ionicons style={{}} name="sad-outline" size={15} color="#626262" />
                    </View> */}


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
    const [textComment, setTextComment] = useState("");
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const index = useRef(0);
    const { user } = useSelector(
        (state) => state.auth
    );
    var page = 0;
    // console.log('=================',user)
    //goi api lay ra thong tin cac comment cua bai viet co post_id
    const getComment = async (postId) => {
        setCalling(true);
        if (isLoading) return;
        setIsLoading(true);
        const listComment = await axios.post(
            '/get_mark_comment',
            {
                id: postId,
                index: page,
                count: 3
            });
        setCalling(false);
        console.log("______________________________________")
        console.log("postId:", postId)
        console.log("comment: ", listComment.data)
        console.log("______________________________________")
        setComments(listComment.data);
        setIsLoading(false);

    }

    async function getMoreComment(){
        setCalling(true);
        page += 3;
        console.log("************", page, "***********")
        let listMoreComment = await axios.post(
            '/get_mark_comment',
            {
                id: postId,
                index: page,
                count: 3
            }
        );
        console.log(listMoreComment, "^^^^^^^^^^^^^^^^^^^^^^^^")
        setCalling(false);
        setComments(comments.concat(listMoreComment.data));
    }


    function handleCommentSubmit(){
        // {
        //     id : postId,
        //     content: content,
        //     index: 0,
        //     count: 10,
        //     type: type
        //   }
        let dataCmt = {count: 10, index: 0, id: postId};
        let textCommentTmp = textComment + " ";
        dataCmt.content = getTextWithIcon(textCommentTmp);
        let type = checked == "trust" ? 1 : 0;
        dataCmt.type = type;
        if(markId.id != "-1"){
            dataCmt.mark_id = markId.id;
        }
        postService.setMarkComment(dataCmt).then((res) => {
            // console.log("res: -------------", res);
            setComments(res.data);
            setTextComment("");
            setMarkId({id: "-1", name: ""});
            setCheckDone(true);
        }).catch((e) => {
            console.log('lỗi -----------', e.response)
        })
    }

    //hàm này gọi khi mở modal comment lên
    const onScreenLoad = async () => {
        await getComment(postId);
    }
    //hàm này gọi khi load tiep comment
    const onLoadComment = async () => {
        index.current = index.current + 10;
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

    const [checked, setChecked] = useState("trust");

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
    }, []);

    const [markId, setMarkId] = useState({id: "-1", name: ""});
    function handleMarkId(id){
        // console.log("Mark id is: ", id);
        setMarkId(id);
    }
    const [showListFeel, setShowListFeel] = useState(false);
    const [h, setH] = useState(400);//chieu cao khi cuon
    const [isEdit, setIsEdit] = useState(false);
    function editComment(data){
        // console.log("&&&&&&&&&&&&&", data);
        setIsEdit(true);
        setTextComment(data.content);
        if (data.type != "-1"){
            setChecked(data.type == "1" ? "trust" : "fake");
        }
        if (data.parentId != "-1"){
            setMarkId({id: data.parentId, name: data.name});
        }
    }

    function cancelEdit(){
        setIsEdit(false);
        setTextComment("");
        setChecked("trust");
        setMarkId({id: "-1", name: ""});
    }

    const [checkDone, setCheckDone] = useState(false);
    const [calling, setCalling] = useState(false);

    return (
        <View>
            <ListFeelComponent isVisible={!showListFeel} id={postId} closeModal={() => setShowListFeel(!showListFeel)}></ListFeelComponent>
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
                                onPress={() => setShowListFeel(!showListFeel)}
                            >
                                {/* <Ionicons style={{marginTop: 3}} name="thumbs-up" size={23} color="#1e90ff" /> */}
                                <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                                <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                                {/* <Text style={{fontSize: 20, fontWeight: "bold", color: 'black', marginTop: 3}}> 1.234</Text> */}
                                <Ionicons style={{}} name="chevron-forward-outline" size={33} color="black" />
                            </TouchableOpacity>

                            {/* <AntDesign name={like} size={22} color={'#216fdb'} onPress={() => { if (like == "like1") setLike("like2"); else setLike("like1"); handleLikeSound(); }} /> */}
                        </View>

                        {
                            calling && (
                                <View>
                                    <SplashComment></SplashComment>
                                </View>
                            )
                        }

                        {/* thanh phù hợp nhất */}
                        {
                            !calling && (
                                <View style={styles.phuhopnhat}>
                                    <TouchableOpacity onPress={getMoreComment}>
                                        <Text style={{ fontSize: 20, marginTop: -5 }}>Xem bình luận cũ hơn</Text>
                                    </TouchableOpacity>
                                    <Ionicons style={{ flex: 1, alignItems: "flex-end", border: 1 }} name="chevron-down-outline" size={23} color="black"/>
                                </View>
                            )
                        }

                        {/* thanh comment */}
                        {
                            !calling && (
                                <View style={styles.comment}>
                                    {isConnected ? <FlatList
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        data={comments}
                                        renderItem={(data) => {
                                            const item = data.item;
                                            // console.log("DATA: ", data.item)
                                            /*
                                                *************************************
                                                if người dùng hiện tại không chặn người đăng comment này
                                                *************************************
                                            */
                                            if(data.item.comments.length == 0){
                                                return <ComponentComment checkDoneEdit={checkDone} cancelEdit={cancelEdit} isOwner={user.id == item.poster.id} markId={item.id} parentId={"-1"} time={formatTimeDifference(item.created)} urlImage={item.poster.avatar} key={data.index} name={item.poster.name} textComment={item.mark_content} type={item.type_of_mark} callback={handleMarkId} edit={editComment} />
                                            }else{
                                                return <View>
                                                    <ComponentComment checkDoneEdit={checkDone} cancelEdit={cancelEdit} isOwner={user.id == item.poster.id} markId={item.id} parentId={"-1"} time={formatTimeDifference(item.created)} urlImage={item.poster.avatar} key={data.index} name={item.poster.name} textComment={item.mark_content} type={item.type_of_mark} callback={handleMarkId} edit={editComment}/>
                                                    <View style={{marginLeft: 50}}>
                                                        {item.comments.map((childData, index) => (
                                                            <ComponentComment cancelEdit={cancelEdit} isOwner={user.id == childData.poster.id} parentId={item.id} time={formatTimeDifference(childData.created)} urlImage={childData.poster.avatar} key={index} name={childData.poster.name} textComment={childData.content} type="-1" edit={editComment}/>
                                                        ))}
                                                    </View>
                                                </View>
                                            }
                                        }}
                                        // Performance settings
                                        removeClippedSubviews={true} // Unmount components when outside of window 
                                        initialNumToRender={1} // Reduce initial render amount
                                        maxToRenderPerBatch={1} // Reduce number in each render batch
                                        updateCellsBatchingPeriod={100} // Increase time between renders
                                        windowSize={7} // Reduce the window size
                                        //onScrollBeginDrag={() => endScroll.current = false}
                                        //onScrollEndDrag={() => endScroll.current = true}
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
                            )
                        }

                        {/* thanh viết bình luận */}
                        <View style={styles.binhluan}>
                            {/* {
                                isEdit && (
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text>
                                        Đang chỉnh sửa bình luận
                                    </Text>
                                    <TouchableOpacity onPress={() => setIsEdit(false)}>
                                        <IconButton
                                            icon={() => <Icon name="times" size={15} color="black" />} // Sử dụng icon "đầu X" từ FontAwesome5
                                        />
                                    </TouchableOpacity>
                                </View>)
                            } */}
                            {
                                markId.id == "-1" && (
                                    <View>
                                        <Text>Gán marks cho bình luận:</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <RadioButton
                                                    value="trust"
                                                    status={checked == "trust" ? 'checked' : 'unchecked'}
                                                    onPress={() => setChecked("trust")}
                                                    color="#0866FF"
                                                />
                                                <Text>Trust</Text>
                                            </View>
            
                                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
                                                <RadioButton
                                                    value="fake"
                                                    status={checked == "fake" ? 'checked' : 'unchecked'}
                                                    onPress={() => setChecked("fake")}
                                                    color="#0866FF"
                                                />
                                                <Text>Fake</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                            <View>
                                {markId.id != "-1" && (
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{marginLeft: 5}}>Đang phản hồi lại <Text style={{fontWeight: 'bold'}}>{markId.name}</Text></Text>
                                        <TouchableOpacity onPress={() => {setMarkId({id: "-1", name: ""}); setTextComment("")}}>
                                            <IconButton
                                                icon={() => <Icon name="times" size={22} color="black" />} // Sử dụng icon "đầu X" từ FontAwesome5
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => { setTextComment(text); }}
                                    value={getTextWithIcon(textComment)}
                                    placeholder=" Viết bình luận..."
                                    keyboardType="default"
                                    // onSubmitEditing={async () => { await setComment(postId); }}
                                />
                                {textComment.trim() !== '' && (
                                    <TouchableOpacity style={styles.sendButton} onPress={() => handleCommentSubmit()}>
                                        <Ionicons name="send" size={25} color="#007BFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
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
        justifyContent: "center"
    },
    phuhopnhat: {

        flex: 1,
        flexDirection: "row",

    },
    comment: {

        flex: 10
    },
    binhluan: {
        flex: 2.4,
        borderTopWidth: 1.5,
        borderTopColor: '#d2d2d2'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    input: {
        fontSize: 22,
        height: 50,
        backgroundColor: '#f1f2f4',
        borderRadius: 25,
        paddingLeft: 10,
        flex: 9, // Chiếm 80% chiều rộng
    },
    sendButton: {
        marginLeft: 10,
        flex: 1, // Chiếm 20% chiều rộng
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