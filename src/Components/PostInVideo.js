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
import { Ionicons, Entypo, AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons';
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
import { Video, AVPlaybackStatus, Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import DotModal from './modal/DotModal';
import ReportModal from './modal/ReportModal';
import { onChangeMute, onChangePlayVideoDetail, onChangePlayVideoTab } from '../Redux/videoSlice';
import { resetEmojiSlice, setUserID } from '../Redux/emojiSlice';
import { formatTimeDifference } from '../Services/Helper/common';
function PostInVideo({ navigation, postData, isPlaying, userID }) {

    const [isModalVisible, setModalVisible] = useState(false);

    const handleLongPress = () => {
        setModalVisible(true);
    }
    function handleFeeling(type, isDelete, postId){
        console.log('data: ', type, isDelete, postId);
        if(isDelete) {
            postService.deleteFeel(postId).then((res) => {
                console.log('res del: ', res);
                postUpdated();
            }).catch((e) => {
                console.log(e.response);
            });
            // post.is_felt = "-1";
        }else{
            postService.feel(postId, type).then((res) => {
                console.log(res);
                postUpdated();
            }).catch(e => {
                console.log(e.response);
            });
            // post.is_felt = type;
        };
        setModalVisible(false);
    }

    function handlePressEmo(){
        switch(post.is_felt){
            case "-1": {
                postService.feel(post.id, "1").then((res) => {
                    console.log(res);
                    postUpdated();
                }).catch((e) => {
                    console.log(e);
                });
                break;
            }
            default: {
                postService.deleteFeel(post.id).then((res) => {
                    console.log(res);
                    postUpdated();
                }).catch(e => {
                    console.log(e);
                })
                break;
            }
        }
    }

    const [cntFeel, setCntFeel] = useState("0");
    const [cntMark, setCntMark] = useState("0");

    const dispatch = useDispatch();
    const video = useRef(null);
    const [status, setStatus] = useState({ isPlaying: false });
    const [showComment, setShowComment] = useState(false);
    const [showDot, setShowDot] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [isShowDetailPost, setIsShowDetailPost] = useState(false);
    const [viewImage, setViewImage] = useState(false);
    const [indexViewImage, setIndexViewImage] = useState(0);
    const [post, setPost] = useState(postData);
    // console.log('##########', post);
    const [seemore, setSeemore] = useState(post?.described && post?.described?.length <= 200);
    const [isError, setIsError] = useState(false);
    const [showBtnControl, setShowBtnControl] = useState(false);
    const [focusVideo, setFocusVideo] = useState(false);
    const [videoDimension, setVideoDimension] = useState({ width: 0, height: 0 });
    const { isMuted, playInVideoTab } = useSelector(
        (state) => state.video
    );
    const { user } = useSelector(
        (state) => state.auth
    );
    const { currentTabIndex } = useSelector(
        (state) => state.tab
    )
    const showVideoOption = useRef(false);
    const widthLayout = Dimensions.get('window').width;
    const heightLayout = Dimensions.get('window').height;
    const ratioVideo = useRef(0);
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPost(result.data);
            setCntFeel(String(Number(result.data.disappointed) + Number(result.data.kudos)));
            setCntMark(result.data.can_mark);
            await postService.updateListPostsCache([result.data]);
        }).catch((e) => {
            console.log(e);
        })
    }
    const LeftContent = () => {
        return (
            <TouchableOpacity onPress={() => {
                if(post?.author?.id == user?.id) {
                    navigation.navigate("profile");
                }else{
                    navigation.navigate("profile", {userId: post?.author?.id})
                }
            }}>
                <Avatar.Image size={45} source={
                    post?.author?.avatar === null ? require('../../assets/images/default_avatar.jpg') : { uri: post?.author?.avatar }
                } />
            </TouchableOpacity>
        );
    }
    const RightContent = () => {
        return <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { setShowDot(true) }}>
                <Entypo style={{ top: -10, right: 20 }} name="dots-three-horizontal" size={18} color="#626262" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { console.log(post.id); console.log(post) }}>
                <Ionicons style={{ top: -15, right: 10 }} name="md-close" size={25} color="#626262" />
            </TouchableOpacity>
        </View>
    }
    const handleLikePost = () => {
        // call api like post
        //
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
        const emo = data.find(x => x.name === (post?.state))
        if (emo)
            return data.find(x => x.name === (post?.state)).img;
        else
            return null
    }
    useEffect(() => {
        setVideoDimension({ width: widthLayout, height: 250 });
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
    const handleGoToDetailVideo = (post) => {
        navigation.navigate('anothervideo', {
            postData: post
        });
        dispatch(onChangePlayVideoTab(false))
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
    useEffect(() => {
        if (currentTabIndex !== 2) video.current.pauseAsync();
    }, [currentTabIndex])
    return (
        <View style={{ flex: 1, marginBottom: 10 }}>
            {isError && <CenterModal onClose={() => setIsError(false)} body={"Đã có lỗi xảy ra \n Hãy thử lại sau."} />}
            {showDot && <DotModal postData={post} userID={userID} closeModal={() => setShowDot(false)} setReportDot={setShowReport} navigation={navigation}></DotModal>}
            {showReport && <ReportModal closeModal={() => setShowReport(false)} postID={post?.id}></ReportModal>}
            {showComment && <CommentModal postUpdated={() => postUpdated()} navigation={navigation} postId={post.id} closeModal={() => setShowComment(false)} />}
            <Card style={{ backgroundColor: 'white' }}>
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
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{post?.author?.name + ' '}</Text>
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
                                <Text style={{ fontSize: 12, color: '#606060' }}>{formatTimeDifference(post?.created)}</Text>
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
                        // onTouchEnd={() => handleGoToDetailVideo(post)}

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


                <View style={{marginLeft: 15, marginRight: 15}}>
                    <View style={{
                        // flex: 2,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>

                        <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                            <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                            <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                            <Text style={{ top: 4, left: 3, color: "#626262" }}>
                                {post.is_felt == "-1" ? (post.feel ? post.feel : cntFeel) : (Number(post.feel ? post.feel : cntFeel) > 1 ? 'Bạn và ' + String(Number(post.feel ? post.feel : cntFeel) -1) + ' người khác' : 'Bạn')}
                            </Text>
                        </View>

                        <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                            <Text style={{ top: 4, left: 3, color: "#626262" }}> 
                                {post.comment_mark ? post.comment_mark : cntMark} Marks
                            </Text>
                        </View>

                    </View>

                    <View style={{
                        // flex: 1,
                        marginTop: 10,
                        marginBottom: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                            {
                                post.is_felt != "0" && (
                                    <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color= {post.is_felt != "-1" ? "#6BB7EC" : "#ada1a1"} />
                                )
                            }
                            {
                                post.is_felt == "0" && (
                                    <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color= {"#F42548"} />
                                )
                            }
                            <TouchableOpacity onLongPress={handleLongPress} onPress={handlePressEmo}>
                                {post.is_felt == "0" && (<Text style={{ top: 4, left: 3, color: "#F42548" }}> Dissapointed </Text>)}
                                {post.is_felt == "-1" && (<Text style={{ top: 4, left: 3, color: "#626262" }}> Kudos </Text>)}
                                {post.is_felt == "1" && (<Text style={{ top: 4, left: 3, color: "#6BB7EC" }}> Kudos </Text>)}
                            </TouchableOpacity>

                            {
                                isModalVisible && (
                                    <View style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        top: -70,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: '#fff',
                                        borderColor: '#f2ebeb',
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 50,
                                        width: 120
                                    }}>
                                        <TouchableOpacity onPress={() => {
                                            handleFeeling("1", post.is_felt == "1" ? true : false, post.id);
                                            // post.is_felt = post.is_felt == "1" ? "-1" : "1";
                                        }}>
                                            <Ionicons style={{ top: 2, marginLeft: 5 }} name="happy-sharp" size={22} color="#6BB7EC" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            handleFeeling("0", post.is_felt == "0" ? true : false, post.id);
                                            // post.is_felt = post.is_felt == "0" ? "-1" : "0";
                                        }}>
                                            <Ionicons style={{ top: 2, marginLeft: 8, marginRight: 8 }} name="sad-sharp" size={22} color="#F42548" />
                                        </TouchableOpacity>
                                        <Text onPress={() => setModalVisible(false)} style={{marginRight: 5, color: '#626262'}}>Đóng</Text>
                                    </View>
                                )
                            }

                            {/* <Modal visible={isModalVisible}>
                                <View>
                                    <Text>Chọn lựa chọn của bạn:</Text>
                                    <TouchableOpacity onPress={() => handleFeel(isModalVisible,post.is_felt, 1)}>
                                        <Text>kudos</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleFeel(isModalVisible,post.is_felt, 0)}>
                                        <Text>dissapointed</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <Text>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal> */}


                        </View>
                        <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }} onPress={() => setShowComment(true)}>
                            <Ionicons style={{ top: 2 }} name="chatbox-outline" size={22} color="#626262" />
                            <Text style={{ top: 4, left: 3, color: "#626262" }}> Mark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.75} style={{ flexDirection: "row", }}>
                            <Ionicons style={{ top: 2 }} name="share-social-outline" size={22} color="#626262" />
                            <Text style={{ top: 4, left: 3, color: "#626262" }}>Chia sẻ</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <Card.Actions>

                </Card.Actions>
            </Card>
        </View>
    );
}

export default memo(PostInVideo);
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