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
    getTextWithIcon,
    delay,
    convertMsToTime
} from '../Services/Helper/common';
import { Ionicons, Entypo, MaterialIcons, AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons';
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
import { Video, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import { onChangeMute } from '../Redux/videoSlice';
function VideoDetail({ navigation, postData, isPlaying }) {
    const dispatch = useDispatch();
    const video = useRef(null);
    const [status, setStatus] = useState({ isPlaying: false });
    const [showComment, setShowComment] = useState(false);
    const [isShowDetailPost, setIsShowDetailPost] = useState(false);
    const [viewImage, setViewImage] = useState(false);
    const [indexViewImage, setIndexViewImage] = useState(0);
    const [post, setPost] = useState(postData);
    const [seemore, setSeemore] = useState(post?.described && post?.described?.length <= 200);
    const [isError, setIsError] = useState(false);
    const [showBtnControl, setShowBtnControl] = useState(false);
    const [focusVideo, setFocusVideo] = useState(false);
    const [videoDimension, setVideoDimension] = useState({ width: 0, height: 0 });
    const { isMuted } = useSelector(
        (state) => state.video
    );
    const showVideoOption = useRef(false);
    const widthLayout = Dimensions.get('window').width;
    const heightLayout = Dimensions.get('window').height;
    const ratioVideo = useRef(0);
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPost(result.data);
            await postService.updateListPostsCache([result.data]);
        }).catch((e) => {
            console.log(e);
        })
    }
    const LeftContent = () => {
        return <Avatar.Image size={45} source={
            post?.author?.avatar === null ? require('../../assets/images/default_avatar.jpg') : { uri: post?.author?.avatar }
        } />
    }
    const RightContent = () => {
        return <View style={{ flexDirection: 'row' }}>
            <Entypo style={{ top: -10, right: 20 }} name="dots-three-horizontal" size={18} color="#626262" />
            <Ionicons style={{ top: -15, right: 10 }} name="md-close" size={25} color="#626262" />
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
    const uriEmoji = () => {
        return data.find(x => x.name === (post?.state)).img;
    }
    useEffect(() => {
        if (post?.video && post?.video?.height && post?.video?.width) {
            const videoWidth = widthLayout, videoHeight = widthLayout * post?.video?.height / post?.video?.width;
            setVideoDimension({ width: videoWidth, height: videoHeight });
        }
    }, [post]);
    const handleShowButtonControl = async () => {
        setShowBtnControl(true);
        await delay(3000);
        if (!showVideoOption.current) setShowBtnControl(false);
    }
    const handleChangeDurationVideo = (ratio) => {
        if (status?.durationMillis) {
            video.current.setPositionAsync(status?.durationMillis * ratio);
            video.current.playAsync();
        }
    }
    useEffect(() => {
        if (isPlaying) video.current.playAsync();
        else video.current.pauseAsync();
    }, [isPlaying])
    useEffect(() => {
        if (status.isPlaying) {
            handleShowButtonControl();
        }
    }, [status.isPlaying])
    useEffect(() => {
        if (focusVideo) {
            handleShowButtonControl();
        }
    }, [focusVideo]);
    return (
        <View style={{ flex: 1, marginBottom: 10 }}>
            {isError && <CenterModal onClose={() => setIsError(false)} body={"Đã có lỗi xảy ra \n Hãy thử lại sau."} />}
            {showComment && <CommentModal postUpdated={() => postUpdated()} navigation={navigation} postId={post.id} closeModal={() => setShowComment(false)} />}
            <Card style={{ backgroundColor: '#333436' }}>
                <Card.Title
                    titleStyle={{ flexDirection: 'row' }}
                    title={
                        <Text>
                            <View style={{ flexDirection: 'row', width: 200 }}>
                                <Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>{post?.author?.username + ' '}</Text>
                                    {post?.state && <Image source={{ uri: uriEmoji() }} style={styles.emoji} />}
                                    {post?.state && <Text style={{ fontWeight: 'normal', fontSize: 15, color: 'white' }}>
                                        {` đang cảm thấy ${post?.state}`}
                                    </Text>}

                                </Text>
                            </View>
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
                                    styleText={{ fontSize: 15, color: 'white' }}
                                    styleIcon={{ width: 17, height: 17 }} /> :
                                <ViewWithIcon value={post?.described?.slice(0, 200) + "... "}
                                    styleText={{ fontSize: 15, color: 'white' }}
                                    styleIcon={{ width: 17, height: 17 }} />
                            }</Text>) : (<Text />)}
                            {(post?.described) ? (!seemore && <Text style={{ color: '#9c9c9e', fontWeight: '500' }} onPress={() => setSeemore(true)}>Xem thêm</Text>) : null}

                        </Paragraph>
                    </TouchableOpacity>
                </Card.Content>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: '#ecf0f1',
                }}>
                    <Video
                        ref={video}
                        style={{
                            alignSelf: 'center',
                            width: videoDimension.width,
                            height: videoDimension.height,
                        }}
                        source={{
                            uri: post?.video?.url
                        }}
                        isLooping
                        isMuted={isMuted}
                        resizeMode="cover"
                        onPlaybackStatusUpdate={
                            status => setStatus(status)
                        }
                        onTouchStart={() => setFocusVideo(true)}
                        onTouchEnd={() => setFocusVideo(false)}
                    />
                    <View style={{ position: 'absolute' }}>
                        {
                            !status.isPlaying
                            && <Ionicons onPress={() => {
                                video.current.playAsync()
                            }}
                                color="white" name="md-play-circle-outline" size={80} />
                        }
                        {
                            status.isPlaying && showBtnControl
                            && <Ionicons
                                onPress={() => {
                                    video.current.pauseAsync()
                                }} color="white" name="pause-circle-outline" size={80} />
                        }
                    </View>
                </View>
                {
                    showBtnControl && <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', position: 'absolute', bottom: -20, marginLeft: -15 }}>
                            <Slider
                                style={{ width: '110%', height: 40 }}
                                minimumValue={0}
                                maximumValue={1}
                                value={
                                    status?.positionMillis
                                        ? status?.positionMillis / status?.durationMillis
                                        : 0
                                }
                                onValueChange={(e) => ratioVideo.current = e}
                                onSlidingStart={(e) => showVideoOption.current = true}
                                onSlidingComplete={(e) => showVideoOption.current = false}
                                onTouchEnd={(e) => handleChangeDurationVideo(ratioVideo.current)}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#FFFFFF"
                                thumbTintColor="#FFFFFF"
                            />
                        </View>
                    </View>
                }
                {
                    showBtnControl && <View style={{
                        flex: 1,
                    }}>
                        <Text style={{ color: 'white', position: 'absolute', fontSize: 14, top: -45, left: 10 }}>
                            {
                                status?.positionMillis
                                    ? convertMsToTime(status?.positionMillis) + ' / ' + convertMsToTime(status?.durationMillis)
                                    : "0:00 / 0:00"
                            }
                        </Text>
                        <View style={{ position: 'absolute', fontSize: 14, top: -45, right: 110 }}>
                            <Ionicons
                                onPress={() => {
                                   
                                }} color="white" name="settings-sharp" size={20} />
                        </View>
                        {
                            !isMuted && <View style={{ position: 'absolute', fontSize: 14, top: -46, right: 56 }}>
                                <SimpleLineIcons
                                    onPress={() => {
                                        showVideoOption.current = true;
                                        dispatch(onChangeMute(true));
                                    }} color="white" name="volume-2" size={22} 
                                    onTouchEnd={() => showVideoOption.current = false}    
                                />
                            </View>
                        }
                        {
                            isMuted && <View style={{ position: 'absolute', fontSize: 14, top: -46, right: 56 }}>
                                <SimpleLineIcons
                                    onPress={() => {
                                        showVideoOption.current = true;
                                        dispatch(onChangeMute(false));
                                    }} color="white" name="volume-off" size={22} 
                                    onTouchEnd={() => showVideoOption.current = false}    
                                />
                            </View>
                        }
                        
                        <View style={{ position: 'absolute', fontSize: 14, top: -42, right: 10 }}>
                            <AntDesign
                                onPress={() => {
                                   
                                }} color="white" name="arrowsalt" size={16} />
                        </View>
                    </View>
                }
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
                                <AntDesign name="like1" size={10} color={"white"} style={{ top: 1, padding: 4, borderRadius: 10, backgroundColor: COMMON_COLOR.LIKE_BLUE_COLOR }} />
                                <Text style={{ left: 5, color: "white" }}>
                                    {+post?.is_liked === 1 ? `Bạn ${post?.like - 1 > 0 ? `và ${converNumberLikeAndComment(post?.like - 1)} người khác` : ''}` : converNumberLikeAndComment(post?.like)}
                                </Text>
                            </View>

                            <TouchableOpacity style={{ flexDirection: "row", }}>
                                <Text style={{ color: "white" }}>{post?.comment} bình luận</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ height: 1, backgroundColor: '#444444', marginVertical: 15, marginHorizontal: 5 }} />
                        <View style={{
                            flex: 1,
                            marginHorizontal: 20,
                            marginBottom: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>

                            <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => { handleLikePost(); console.log("seemore", seemore) }}>
                                <AntDesign name={+post?.is_liked === 1 ? 'like1' : 'like2'} size={22} color={+post?.is_liked === 1 ? COMMON_COLOR.LIKE_BLUE_COLOR : "white"} />
                                <Text style={{ top: 4, left: 3, color: "white" }}>Thích</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => setShowComment(true)}>
                                <Ionicons style={{ top: 3 }} name="chatbox-outline" size={22} color="white" />
                                <Text style={{ top: 4, left: 3, color: "white" }}>Bình luận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }}>
                                <Ionicons style={{ top: 2 }} name="share-social-outline" size={22} color="white" />
                                <Text style={{ top: 4, left: 3, color: "white" }}>Chia sẻ</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </Card.Actions>
            </Card>
        </View>
    );
}

export default memo(VideoDetail);
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