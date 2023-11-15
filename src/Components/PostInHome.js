import React, { useEffect, useState, memo, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Dimensions,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache,
    converNumberLikeAndComment,
    getTextWithIcon
} from '../Services/Helper/common';
import { Ionicons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { getTimeUpdatePostFromUnixTime } from '../Services/Helper/common';
import postService from '../Services/Api/postService';
import CenterModal from './modal/CenterModal';
import DetailPostModal from './modal/DetailPostModal';
import PostModalOneImage from './modal/PostModalOneImage';
import ViewImage from './image/ViewImage';
import { COMMON_COLOR } from '../Services/Helper/constant';
import ViewWithIcon from './ViewWithIcon';
import CommentModal from './modal/CommentModal';
import data from '../Screens/img/emoji';
import DotModal from './modal/DotModal';
import ReportModal from './modal/ReportModal';
import { Audio } from 'expo-av';
import { resetEmojiSlice, setUserID } from '../Redux/emojiSlice';
function PostInHome({ navigation, postData, userID, avatar }) {
    const dispatch = useDispatch();
    const [showComment, setShowComment] = useState(false);
    const [showDot, setShowDot] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [isShowDetailPost, setIsShowDetailPost] = useState(false);
    const [viewImage, setViewImage] = useState(false);
    const [indexViewImage, setIndexViewImage] = useState(0);
    const [post, setPost] = useState(postData);
    const [seemore, setSeemore] = useState(post?.described && post?.described?.length <= 200);
    const [isError, setIsError] = useState(false);
    const [videoDimension, setVideoDimension] = useState({ width: 0, height: 0 });
    const widthLayout = Dimensions.get('window').width;
    const heightLayout = Dimensions.get('window').height;
    const { user } = useSelector(
        (state) => state.auth
    );
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPost(result.data);
            await postService.updateListPostsCache([result.data]);
        }).catch((e) => {
            console.log(e);
        })
    }
    const LeftContent = () => {
        return (
            <TouchableOpacity onPress={() => {
                //console.log("userId", post?.author?.id);
                if(post?.author?.id == user?.id) {
                    navigation.navigate("profile");
                }else{
                    navigation.navigate("profile", {userId: post?.author?.id})
                }
            }}>
                <Avatar.Image size={45} source={
                    avatar ? avatar : post?.author?.avatar === null ? require('../../assets/images/default_avatar.jpg') : { uri: avatar ? avatar : post?.author?.avatar }
                } />
            </TouchableOpacity>
        );
    }
    const RightContent = () => {
        return <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { setShowDot(true) }}>
                <Entypo style={{ top: -10, right: 20 }} name="dots-three-horizontal" size={18} color="#626262" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
                <Ionicons style={{ top: -15, right: 10 }} name="md-close" size={25} color="#626262" />
            </TouchableOpacity>
        </View>
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
    const handleLikeSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/like_sound.mp3'), { shouldPlay: true });
            await sound.playAsync();
        } catch (e) {
            console.log(e);
        }
    }
    const uriEmoji = () => {
        return data.find(x => x.name === (post?.state)).img;
    }
    useEffect(() => {
        setPost(postData);
    }, [postData])
    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            {isShowDetailPost && post?.image && post?.image?.length > 1 && <DetailPostModal callBackPostUpdated={() => postUpdated()} onClose={() => setIsShowDetailPost(false)}
                navigation={navigation}
                postData={post} viewImage={(index) => {
                    setViewImage(true);
                    setIndexViewImage(index);
                }
                } />}
            {isShowDetailPost && post?.image && post?.image?.length === 1 && <PostModalOneImage callBackPostUpdated={() => postUpdated()} onClose={() => setIsShowDetailPost(false)}
                navigation={navigation}
                postData={post} viewImage={(index) => {
                    setViewImage(true);
                    setIndexViewImage(index);
                }
                } />}

            {isError && <CenterModal onClose={() => setIsError(false)} body={"Đã có lỗi xảy ra \n Hãy thử lại sau."} />}
            {viewImage && <ViewImage images={post?.image} index={indexViewImage} onClose={() => setViewImage(false)} />}
            {showDot && <DotModal postData={post} userID={userID} closeModal={() => setShowDot(false)} setReportDot={setShowReport} navigation={navigation}></DotModal>}
            {showReport && <ReportModal closeModal={() => setShowReport(false)} postID={post?.id}></ReportModal>}
            {showComment && <CommentModal postUpdated={() => postUpdated()} navigation={navigation} postId={post.id} closeModal={() => setShowComment(false)} />}
            <Card>
                <Card.Title
                    titleStyle={{ flexDirection: 'row' }}
                    title={
                        <Text>
                            <TouchableOpacity onPress={() => {
                                if(post?.author?.id == user?.id) {
                                    navigation.navigate("profile");
                                }else{
                                    navigation.navigate("profile", {userId: post?.author?.id})
                                }
                            }}>
                                <Text style={{ width: 200 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{post?.author?.username + ' '}</Text>
                                    {post?.state && <Image source={{ uri: uriEmoji() }} style={styles.emoji} />}
                                    {post?.state && <Text style={{ fontWeight: 'normal', fontSize: 15 }}>
                                        {` đang cảm thấy ${post?.state}`}
                                    </Text>}
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    }
                    titleNumberOfLines={1}
                    subtitleNumberOfLines={1}
                    subtitle={
                        <Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, color: '#606060' }}>{getTimeUpdatePostFromUnixTime(post?.modified)}</Text>
                                <Text style={{ fontSize: 10, marginHorizontal: 2, top: 1, color: '#606060' }}>{" • "}</Text>
                                <Image style={{ width: 12, height: 12, top: 2, opacity: 0.6 }} source={require('../../assets/icons/public-icon-facebook.png')} />
                            </View>
                        </Text>
                    } left={LeftContent}
                    right={RightContent}
                />
                <Card.Content>
                    <TouchableOpacity onPress={() => { if (post?.described && post?.described?.length > 200) setSeemore(!seemore) }}>
                        <Paragraph style={{ fontSize: 15 }}>
                            {(post?.described) ? (<Text>{seemore ?
                                <ViewWithIcon value={post?.described}
                                    styleText={{ fontSize: 15 }}
                                    styleIcon={{ width: 17, height: 17 }} /> :
                                <ViewWithIcon value={post?.described?.slice(0, 200) + "... "}
                                    styleText={{ fontSize: 15 }}
                                    styleIcon={{ width: 17, height: 17 }} />
                            }</Text>) : (<Text />)}
                            {(post?.described) ? (!seemore && <Text style={{ color: '#9c9c9e', fontWeight: '500' }} onPress={() => setSeemore(true)}>Xem thêm</Text>) : null}

                        </Paragraph>
                    </TouchableOpacity>
                </Card.Content>

                <TouchableOpacity activeOpacity={0.8} style={{ marginTop: 5 }}
                    onPress={() => {
                        setIsShowDetailPost(true);
                    }}
                >
                    {post?.image && post?.image?.length > 0 &&
                        <View style={{ height: widthLayout - 40, width: '100%', flexDirection: 'row' }}>
                            {post?.image[0]?.url
                                && <View style={{ flex: 1, paddingRight: post?.image[1]?.url ? 2 : 0 }}>
                                    <Image style={{ width: '100%', height: '100%' }} source={{ uri: post?.image[0]?.url }} />
                                </View>
                            }
                            {post?.image[1]?.url && <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 2 }}>
                                <View style={{ flex: 1, paddingBottom: post?.image[2]?.url ? 2 : 0 }}>
                                    <Image style={{ width: '100%', height: '100%' }} source={{ uri: post?.image[1]?.url }} />
                                </View>

                                {post?.image[2]?.url &&
                                    <View style={{ flex: 1, paddingTop: 2 }}>
                                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: post?.image[2]?.url }} />
                                        {post?.image[3]?.url && <View style={{
                                            width: '100%', height: '100%', position: 'absolute',
                                            justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: 'black', top: 2, opacity: 0.5
                                        }}>
                                            <Text style={{ color: 'white', fontSize: 30 }}>+1</Text>
                                        </View>}
                                    </View>
                                }
                            </View>
                            }
                        </View>
                    }
                </TouchableOpacity>
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
                            <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => { handleLikePost(); console.log("seemore", seemore); handleLikeSound() }}>
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
        </View>
    );
}

export default PostInHome;
const styles = StyleSheet.create({
    emoji: {
        marginLeft: 5,
        width: 20,
        height: 20,
        borderRadius: 50,
        marginBottom: 5
    },
    container: {

    },
    video: {

    },
    buttons: {

    },
});