import React, { useEffect, useState, memo, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Dimensions,
    Image,
    Pressable
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
import moment from 'moment';
import {FlatList, Modal, ScrollView } from "react-native";
import { Alert } from 'react-native';
import { formatTimeDifference } from '../Services/Helper/common';
import FeelingBar from './FeelingBar';
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

    //___________________________________________________________________-
    const [isModalVisible, setModalVisible] = useState(false);

    const handleLongPress = () => {
        setModalVisible(true);
    }
    //___________________________________________________________________-

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
                console.log("userId", post?.author?.id);
                if(post?.author?.id == user?.id) {
                    navigation.navigate("profile");
                }else{
                    navigation.navigate("profile", {userId: post?.author?.id})
                }
            }}>
                <Avatar.Image size={45} source={
                    avatar ? avatar : post?.author?.avatar === "" ? require('../../assets/images/default_avatar.jpg') : { uri: avatar ? avatar : post?.author?.avatar }
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
    const handleCommentPost = () => {
        // call api like post
        postService.setMarkComment(post?.id, content, type).then((data) => {
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

    function handleFeeling(type, isDelete, postId){
        console.log('data: ', type, isDelete, postId);
        if(isDelete) {
            postService.deleteFeel(postId).then((res) => {
                console.log('res del: ', res);
                postUpdated();
            }).catch((e) => {
                console.log(e.response);
            });
            post.is_felt = "-1";
        }else{
            postService.feel(postId, type).then((res) => {
                console.log(res);
                postUpdated();
            }).catch(e => {
                console.log(e.response);
            });
            post.is_felt = type;
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

    useEffect(() => {
        setPost(postData);
        console.log("_______________________________", post)
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
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{post?.author?.name + ' '}</Text>
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

                <TouchableOpacity activeOpacity={0.8} style={{ marginTop: 5 }}
                    onPress={() => {
                        setIsShowDetailPost(true);
                    }}
                >
                    {post?.image && post?.image.length > 0 &&
                            <View style={{ height: widthLayout - 40, width: '100%', flexDirection: 'row' }}>
                            {post?.image.map((image, index) => (
                                <View
                                    key={index}
                                    style={{
                                    flex: 1,
                                    paddingRight: index < post.image.length - 1 ? 2 : 0,
                                    flexDirection: 'column',
                                    }}
                                >
                                    <Image style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: image.url }} />
                                    {index === post.image.length - 1 && post.image.length > 1 && (
                                    <View
                                        style={{
                                        flex: 1,
                                        position: 'absolute',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'black',
                                        top: 0,
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        opacity: 0.5,
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 30 }}>+{post.image.length - 1}</Text>
                                    </View>
                                    )}
                                </View>
                            ))}
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

                            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                                <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                                <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                                <Text style={{ top: 4, left: 3, color: "#626262" }}>
                                    {post.feel}
                                </Text>
                            </View>

                            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                                <Text style={{ top: 4, left: 3, color: "#626262" }}> 
                                    {post.comment_mark} Marks
                                </Text>
                            </View>

                        </View>
                        <View style={{ height: 1, backgroundColor: '#e7e7e7', marginVertical: 15, marginHorizontal: 5 }} />
                        <View style={{
                            flex: 1,
                            marginHorizontal: 20,
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