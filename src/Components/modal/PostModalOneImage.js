import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
    ScrollView,
    Modal,
    BackHandler
} from 'react-native';

import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache,
    converNumberLikeAndComment,
    getTextWithIcon
} from '../../Services/Helper/common';
import { Ionicons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { getTimeUpdateDetailPostFromUnixTime } from '../../Services/Helper/common';
import postService from '../../Services/Api/postService';
import CenterModal from '../modal/CenterModal';
import ScaledImage from '../image/ScaleImage';
import { COMMON_COLOR } from '../../Services/Helper/constant';
import ViewWithIcon from '../ViewWithIcon';
import CommentModal from './CommentModal';
export default function PostModalOneImage({ navigation, postData, onClose, viewImage, callBackPostUpdated }) {
    const dispatch = useDispatch();
    const [post, setPost] = useState(postData);
    const [isError, setIsError] = useState(false);
    const [seemore, setSeemore] = useState(post?.described && post?.described?.length <= 50);
    const [collapse, setCollapse] = useState(post?.described && post?.described?.length > 50);
    const [showComment, setShowComment] = useState(false)
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPost(result.data);
            callBackPostUpdated();
        }).catch((e) => {
            console.log(e);
        })
    }
    const handleLikePost = () => {
        // call api like post
        postService.likePost(post?.id).then((data) => {
            postUpdated();
        }).catch((e) => {
            console.log(e);
            setIsError(true);
        });
    }
    return (
        <>
            {showComment && <CommentModal postUpdated={() => postUpdated()} navigation={navigation} postId={post.id} closeModal={() => setShowComment(false)} />}
            <Modal
                animationType="fade"
                transparent={false}
                visible={true}
                onRequestClose={() => onClose()}
            >
                <View style={styles.container}>
                    {isError && <CenterModal onClose={() => setIsError(false)} body={"Đã có lỗi xảy ra \n Hãy thử lại sau."} />}
                    <View style={{ marginTop: 5 }}>
                        <ScaledImage uri={post?.image[0].url} onPress={() => viewImage(0)} />
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.5 }}>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{post?.author?.username}</Text>
                        <Text>{seemore ?
                            <><Text>
                                {
                                post?.described && <ViewWithIcon value={post?.described}
                                    styleText={{ fontSize: 15, color: 'white' }}
                                    styleIcon={{ width: 17, height: 17 }} />
                                }
                            </Text>
                                {collapse && <Text style={{ color: '#9c9c9e', fontWeight: '500' }} onPress={() => setSeemore(false)}>{'Thu gọn'}</Text>}
                            </>
                            : post?.described && <ViewWithIcon value={post?.described?.slice(0, 50) + "... "}
                                styleText={{ fontSize: 15, color: 'white' }}
                                styleIcon={{ width: 17, height: 17 }} />}
                        </Text>
                        {!seemore && post?.described && <Text style={{ color: '#9c9c9e', fontWeight: '500' }} onPress={() => setSeemore(true)}>Xem thêm</Text>}

                        <Text style={{ color: '#ccc', marginTop: 20, fontSize: 12 }}>{getTimeUpdateDetailPostFromUnixTime(post?.modified)}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        marginHorizontal: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>

                        <View style={{ flexDirection: "row", }}>
                            <AntDesign name="like1" size={10} color="white" style={{ top: 1, padding: 4, borderRadius: 20, backgroundColor: COMMON_COLOR.LIKE_BLUE_COLOR }} />
                            <Text style={{ left: 5, color: "white" }}>
                                {+post?.is_liked === 1 ? `Bạn ${post?.like - 1 > 0 ? `và ${converNumberLikeAndComment(post?.like - 1)} người khác` : ''}` : converNumberLikeAndComment(post?.like)}
                            </Text>
                        </View>

                        <TouchableOpacity style={{ flexDirection: "row", }}>
                            <Text style={{ color: "white" }}>{post?.comment} bình luận</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ height: 1, backgroundColor: '#4c4c4c', marginVertical: 15, marginHorizontal: 5 }} />
                    <View style={{
                        flex: 1,
                        marginHorizontal: 20,
                        marginBottom: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 20
                    }}>

                        <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => handleLikePost()}>
                            <AntDesign name={+post?.is_liked === 1 ? 'like1' : 'like2'} size={22} color={+post?.is_liked === 1 ? COMMON_COLOR.LIKE_BLUE_COLOR : 'white'} />
                            <Text style={{ top: 4, left: 3, color: "white" }}>Thích</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }}  onPress={() => setShowComment(true)}>
                            <Ionicons style={{ top: 3 }} name="chatbox-outline" size={22} color="white" />
                            <Text style={{ top: 4, left: 3, color: "white" }}>Bình luận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }}>
                            <Ionicons style={{ top: 2 }} name="share-social-outline" size={22} color="white" />
                            <Text style={{ top: 4, left: 3, color: "white" }}>Chia sẻ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'column'
    }
});