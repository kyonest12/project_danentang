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
import { getTimeUpdatePostFromUnixTime } from '../../Services/Helper/common';
import postService from '../../Services/Api/postService';
import CenterModal from '../modal/CenterModal';
import ScaledImage from '../image/ScaleImage';
import { COMMON_COLOR } from '../../Services/Helper/constant';
import ViewWithIcon from '../ViewWithIcon';
import CommentModal from './CommentModal';
function DetailPostModal({ navigation, postData, onClose, viewImage, callBackPostUpdated }) {
    const dispatch = useDispatch();
    const [post, setPost] = useState(postData);
    const [isError, setIsError] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPost(result.data);
            callBackPostUpdated();
        }).catch((e) => {
            console.log(e);
        })
    }
    const LeftContent = () => {
        return <Avatar.Image size={45} source={{ uri: post?.author?.avatar }} />
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
                onRequestClose={() => onClose()}
                animationType="slide"
                transparent={true}
                visible={true}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} style={styles.container}>
                    {isError && <CenterModal onClose={() => setIsError(false)} body={"Đã có lỗi xảy ra \n Hãy thử lại sau."} />}
                    <Card>
                        <Card.Title
                            titleStyle={{ flexDirection: 'row' }}
                            title={
                                <Text>
                                    <View style={{ flexDirection: 'row', width: 200 }}>
                                        <Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{post?.author?.username}</Text>
                                            {post?.status && <Text style={{ fontWeight: 'normal' }}>
                                                {` đang cảm thấy ${post?.state}`}
                                            </Text>}
                                        </Text>
                                    </View>
                                </Text>
                            }
                            titleNumberOfLines={4}
                            subtitleNumberOfLines={1}
                            subtitle={
                                <Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 12, color: '#606060' }}>{getTimeUpdatePostFromUnixTime(post?.modified)}</Text>
                                        <Text style={{ fontSize: 10, marginHorizontal: 2, top: 1, color: '#606060' }}>{" • "}</Text>
                                        <Image style={{ width: 12, height: 12, top: 2, opacity: 0.6 }} source={require('../../../assets/icons/public-icon-facebook.png')} />
                                    </View>
                                </Text>
                            } left={LeftContent}
                        />
                        <Card.Content>
                            <Paragraph style={{ fontSize: 15 }}>
                                {
                                    post?.described && <ViewWithIcon value={post?.described}
                                        styleText={{ fontSize: 15 }}
                                        styleIcon={{ width: 17, height: 17 }} />
                                }
                            </Paragraph>
                        </Card.Content>

                        <View style={{ marginTop: 5 }}>
                            {
                                post?.image?.map((item, index) => {
                                    return <View key={index} style={{ marginTop: 5 }}>
                                        <ScaledImage key={index} uri={item?.url} onPress={() => viewImage(index)} />
                                    </View>
                                })
                            }
                        </View>
                        <Card.Actions>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <View style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}>

                                    <View style={{ flexDirection: "row", }}>
                                        <AntDesign name="like1" size={10} color="white" style={{ top: 1, padding: 4, borderRadius: 10, backgroundColor: COMMON_COLOR.LIKE_BLUE_COLOR }} />
                                        <Text style={{ left: 5, color: "#626262" }}>
                                            {+post?.is_liked === 1 ? `Bạn ${post?.like - 1 > 0 ? `và ${converNumberLikeAndComment(post?.like - 1)} người khác` : ''}` : converNumberLikeAndComment(post?.like)}
                                        </Text>
                                    </View>

                                    <TouchableOpacity style={{ flexDirection: "row", }}>
                                        <Text style={{ color: "#626262" }}>{post?.comment} bình luận</Text>
                                    </TouchableOpacity>

                                </View>
                                <View style={{ height: 1, backgroundColor: '#e7e7e7', marginVertical: 15, marginHorizontal: 5 }} />
                                <View style={{
                                    flex: 1,
                                    marginHorizontal: 20,
                                    marginBottom: 5,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}>

                                    <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => handleLikePost()}>
                                        <AntDesign name={+post?.is_liked === 1 ? 'like1' : 'like2'} size={22} color={+post?.is_liked === 1 ? COMMON_COLOR.LIKE_BLUE_COLOR : '#626262'} />
                                        <Text style={{ top: 4, left: 3, color: "#626262" }}>Thích</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => setShowComment(true)}>
                                        <Ionicons style={{ top: 3 }} name="chatbox-outline" size={22} color="#626262" />
                                        <Text style={{ top: 4, left: 3, color: "#626262" }}>Bình luận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }}>
                                        <Ionicons style={{ top: 2 }} name="share-social-outline" size={22} color="#626262" />
                                        <Text style={{ top: 4, left: 3, color: "#626262" }}>Chia sẻ</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </Card.Actions>
                    </Card>
                </ScrollView>
            </Modal>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default DetailPostModal;
