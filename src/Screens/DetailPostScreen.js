import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import PostInHome from "../Components/PostInHome";
import { useSelector } from "react-redux";
import postService from "../Services/Api/postService";
import { TouchableOpacity } from "react-native";
import { COMMON_COLOR } from "../Services/Helper/constant";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import ComponentComment from "../Components/modal/CommentModal";
import { formatTimeDifference } from "../Services/Helper/common";
import CommentModal from "../Components/modal/CommentModal";

export default function DetailPostScreen({navigation, route}){

    var postId = route?.params?.post.post.id;
    // console.log('post data: ',postId);
    
    const [postData, setPostData] = useState({});
    const [comments, setComments] = useState([]);

    // function getComment(index){
    //     postService.getMarkComment(postId, "0", String((index+1)*3-1)).then((res) => {
    //         console.log('cmt: ',res.data);
    //         setComments(res.data);
    //     }).catch((e) => {
    //         console.log('cmt loi: ', e)
    //     })  
    // }

    useEffect(() => {
        postService.getPost(postId).then((res) => {
            console.log('get post: ', res);
            setPostData(res.data);
            setCntFeel(String(Number(res.data.disappointed) + Number(res.data.kudos)));
            console.log('media: ', res.data.image)
        }).catch((e) => {
            console.log('Loi: ', e.response);
        });
        // getComment(0);
    },[])
    const { user } = useSelector(
        (state) => state.auth
    );
    const [cntFeel, setCntFeel] = useState("0");
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

    function updateTimeAgo(time) {
        const now = new Date();
        const then = new Date(time);
        const timeDiff = now - then;
        
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
        return days + ' ngày trước';
        } else if (hours > 0) {
        return hours + ' giờ trước';
        } else if (minutes > 0) {
        return minutes + ' phút trước';
        } else {
        return 'Vừa xong'
        }
    };
    const [showComment, setShowComment] = useState(false);
    const postUpdated = () => {
        postService.getPost(post.id).then(async (result) => {
            setPostData(result.data);
            console.log('update: ', result);
            setCntFeel(String(Number(result.data.disappointed) + Number(result.data.kudos)));
            // setCntMark(result.data.can_mark);
            await postService.updateListPostsCache([result.data]);
        }).catch((e) => {
            console.log(e);
        })
    }

    return <View>
        {showComment && <CommentModal postUpdated={() => postUpdated()} navigation={navigation} postId={postId} closeModal={() => setShowComment(false)} />}
        <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'center'}}>
            <TouchableOpacity>
                <Image source={
                    !postData.author?.avatar ? require('../../assets/images/default_avatar.jpg')
                        : { uri: postData?.author?.avatar }
                } style={{ width: 60, height: 60, borderRadius: 30, borderColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND, borderWidth: 1, marginLeft: 15 }} />
            </TouchableOpacity>
            <View style={{marginLeft: 20}}>
                <Text>
                    <Text style={{fontWeight: 'bold'}}>{postData?.author?.name }</Text> đang cảm thấy {postData?.state}
                </Text>
                <Text>{updateTimeAgo(postData?.created)}</Text>
            </View>
        </View>

        <Text style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>{postData?.described}</Text>

        {
            (postData?.image?.length > 0) && (
                <View>
                    {postData?.image.map((item) => (
                        <View key={item.id}>
                            <Image source={{uri: item?.url}} style={{height: 300, width: 'auto'}}></Image>
                            <Text style={{marginBottom: 5}}></Text>
                        </View>
                    ))}
                </View>
            )
        }
        {/* feeling bars */}
        <View style={{
            marginLeft: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color="#6BB7EC" />
                <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color="#F42548" />
                <Text style={{ top: 4, left: 3, color: "#626262" }}>
                    {postData?.is_felt == "-1" ? cntFeel : (Number(cntFeel) > 1 ? 'Bạn và ' + String(Number(cntFeel) -1) + ' người khác' : 'Bạn')}
                </Text>
            </View>

            <View style={{marginRight: 25}}>
                <Text style={{color: '#626262'}}>{postData?.can_mark} Marks</Text>
            </View>

        </View>
        <View style={styles.horizontalLine} />

        {/* comment section */}
        <View style={{
            // flex: 1,
            marginHorizontal: 20,
            marginBottom: 5,
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
            <View activeOpacity={.75} style={{ flexDirection: "row", }}>
                {
                    postData?.is_felt != "0" && (
                        <Ionicons style={{ top: 2 }} name="happy-sharp" size={22} color= {postData?.is_felt != "-1" ? "#6BB7EC" : "#ada1a1"} />
                    )
                }
                {
                    postData?.is_felt == "0" && (
                        <Ionicons style={{ top: 2 }} name="sad-sharp" size={22} color= {"#F42548"} />
                    )
                }
                <TouchableOpacity onLongPress={handleLongPress} onPress={handlePressEmo}>
                    {postData?.is_felt == "0" && (<Text style={{ top: 4, left: 3, color: "#F42548" }}> Dissapointed </Text>)}
                    {postData?.is_felt == "-1" && (<Text style={{ top: 4, left: 3, color: "#626262" }}> Kudos </Text>)}
                    {postData?.is_felt == "1" && (<Text style={{ top: 4, left: 3, color: "#6BB7EC" }}> Kudos </Text>)}
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
                                handleFeeling("1", postData?.is_felt == "1" ? true : false, postId);
                                // postData?.is_felt = postData?.is_felt == "1" ? "-1" : "1";
                            }}>
                                <Ionicons style={{ top: 2, marginLeft: 5 }} name="happy-sharp" size={22} color="#6BB7EC" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                handleFeeling("0", postData?.is_felt == "0" ? true : false, postId);
                                // postData?.is_felt = postData?.is_felt == "0" ? "-1" : "0";
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
}

const styles = StyleSheet.create({
    horizontalLine: {
      borderBottomColor: '#626262',
      borderBottomWidth: 1,
      marginVertical: 10, // Adjust the margin as needed
    },
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
  })