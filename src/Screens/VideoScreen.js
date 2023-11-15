import { Text, TextInput, View, Button, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, FlatList } from "react-native";
import { useState, useEffect, memo, useRef } from "react";
import { deepCopy, onlyNumber, _getCache, _setCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, SafeAreaView } from "react-native";
import { fetchListPost } from "../Redux/postSlice";
import postService from '../Services/Api/postService';
import { delay } from '../Services/Helper/common';
import PostInVideo from "../Components/PostInVideo";
import { useNetInfo } from '@react-native-community/netinfo';
import { COMMON_COLOR } from "../Services/Helper/constant";
import { resetEmojiSlice } from "../Redux/emojiSlice";
import { Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
//@trungtt123
function VideoScreen({ route, onSwipeUp, onSwipeDown, navigation }) {
    const defaultCount = 4;
    const defaultIndex = 0;
    const defaultLastId = 0;
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    const layoutOffset = useRef(0);
    const endScroll = useRef(true);
    const { user } = useSelector(
        (state) => state.auth
    );
    const { postList, isPostListLoading, isPendingCreatePost, newCreatePostData, isErrorCreatePost,
        isPendingEditPost, isErrorEditPost, messageEditPost, isPendingDeletePost, isErrorDeletePost, messageDeletePost } = useSelector(
            (state) => state.post
        );
    const [postListTotal, setPostListTotal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(0);
    const onRefresh = async () => {
        setRefreshing(true);
        handleGetListVideos();
        await delay(2000);
        setRefreshing(false);
    };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 50;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    const handleGetListVideos = () => {
        postService.getListVideos(0, 0, 0).then((result) => {
            setPostListTotal(result.data.post);
            // setPostList(result.data.post.slice(0, 4));
        }).catch(e => {
            console.log(e);
        })
    }
    const handleScroll = (nativeEvent) => {
        setCurrentVideo(Math.min(postListTotal.length - 1, Math.max(0, Math.ceil((nativeEvent.contentOffset.y - 50) / nativeEvent.layoutMeasurement.height))));
    }
    useEffect(() => {
        handleGetListVideos();
    }, []);
    useEffect(() => {
        if (!isErrorCreatePost && !isPendingCreatePost && newCreatePostData) {
            onRefresh();
        }
    }, [isPendingCreatePost, newCreatePostData, isErrorCreatePost]);
    useEffect(() => {
        if (!isErrorEditPost && !isPendingEditPost && messageEditPost) {
            onRefresh();
        }
    }, [isPendingEditPost, isErrorEditPost, messageEditPost]);
    useEffect(() => {
        if (!isErrorDeletePost && !isPendingDeletePost && messageDeletePost) {
            onRefresh();
        }
    }, [isPendingDeletePost, isErrorDeletePost, messageDeletePost]);
    return <View style={styles.container}>
        <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={postListTotal}
            renderItem={(data) => {
                if (data.index === 0) {
                    return <>
                        <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginTop: 8 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>WATCH</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.btnRight}>
                                        <Ionicons style={{ left: -1, top: -2 }}
                                            color='black' name='person' size={25} />
                                    </View>
                                    <View style={styles.btnRight}>
                                        <FontAwesome onPress={() => navigation.navigate('search')}
                                            style={{ left: -1, top: -1 }} name="search" size={22} color="black" />
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row', marginVertical: 10,
                                marginHorizontal: 20, justifyContent: 'space-between'
                            }}>
                                <View style={{
                                    flexDirection: 'row', width: 100, justifyContent: 'center',
                                    height: 30, backgroundColor: '#ccc', borderRadius: 25, padding: 5, paddingHorizontal: 10
                                }}>
                                    <Entypo style={{ top: 5, marginRight: 5 }}
                                        color='black' name='video-camera' size={10} />
                                    <Text style={{ fontWeight: 'bold' }}>Trực tiếp</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row', width: 100, justifyContent: 'center',
                                    height: 30, backgroundColor: '#ccc', borderRadius: 25, padding: 5, paddingHorizontal: 10
                                }}>
                                    <MaterialCommunityIcons style={{ top: 4, marginRight: 5 }}
                                        color='black' name='silverware-fork-knife' size={12} />
                                    <Text style={{ fontWeight: 'bold' }}>Ẩm thực</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row', width: 100, justifyContent: 'center',
                                    height: 30, backgroundColor: '#ccc', borderRadius: 25, padding: 5, paddingHorizontal: 10
                                }}>
                                    <Entypo style={{ top: 5, marginRight: 5 }}
                                        color='black' name='game-controller' size={10} />
                                    <Text style={{ fontWeight: 'bold' }}>Chơi game</Text>
                                </View>
                            </View>
                        </View>
                        <PostInVideo
                            isPlaying={currentVideo === data.index} userID={user.id}
                            navigation={navigation} key={data.item.id} postData={data.item} />
                    </>
                }
                return <PostInVideo
                    isPlaying={currentVideo === data.index} userID={user.id}
                    navigation={navigation} key={data.item.id} postData={data.item} />
            }}
            // Performance settings
            removeClippedSubviews={true} // Unmount components when outside of window 
            initialNumToRender={1} // Reduce initial render amount
            maxToRenderPerBatch={1} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={7} // Reduce the window size
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#0f80f7"]}
                />}
            onScroll={({ nativeEvent }) => {
                handleScroll(nativeEvent);
                // if (isCloseToBottom(nativeEvent)) {
                //     pageIndex.current++;
                //     setPostList(postListTotal.slice(pageIndex.current * 4 + (pageIndex.current + 1) * 4));
                //     console.log('end');
                // }
            }}
            scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
        />
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    btnRight: {
        backgroundColor: '#f1f2f4',
        padding: 5,
        borderRadius: 20,
        marginLeft: 10,
        width: 32,
        height: 32
    }
});

export default memo(VideoScreen)