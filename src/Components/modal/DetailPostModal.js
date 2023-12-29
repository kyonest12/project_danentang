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
import { formatTimeDifference } from '../../Services/Helper/common';
function DetailPostModal({ navigation, postData, onClose, viewImage, callBackPostUpdated }) {
    const dispatch = useDispatch();
    const [cntFeel, setCntFeel] = useState("0");
    const [cntMark, setCntMark] = useState("0");
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
                                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{post?.author?.name}</Text>
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
                                        <Text style={{ fontSize: 12, color: '#606060' }}>{formatTimeDifference(post?.created)}</Text>
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

                            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                                <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                                <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                                <Text style={{ top: 4, left: 3, color: "#626262" }}>
                                    {post.is_felt == "-1" ? post.feel : (Number(post.feel ? post.feel : cntFeel) > 1 ? 'Bạn và ' + String(Number(post.feel ? post.feel : cntFeel) -1) + ' người khác' : 'Bạn')}
                                </Text>
                            </View>

                            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                                <Text style={{ top: 4, left: 3, color: "#626262" }}> 
                                    {post.comment_mark ? post.comment_mark : cntMark} Marks
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
