import { Text, TextInput, View, Button, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import { useState, useEffect, memo, useRef } from "react";
import { deepCopy, onlyNumber, _getCache, _setCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, SafeAreaView, FlatList } from "react-native";
import { fetchListPost, resetAddUpdateDeletePost } from "../Redux/postSlice";
import postService from '../Services/Api/postService';
import { delay } from '../Services/Helper/common';
import PostInHome from "../Components/PostInHome";
import { useNetInfo } from '@react-native-community/netinfo';
import { getUserInfo } from '../Redux/userSlice';

import { COMMON_COLOR } from "../Services/Helper/constant";
import { resetEmojiSlice, setUserID } from "../Redux/emojiSlice";
//@trungtt123
function HomeScreen({ route, onSwipeUp, onSwipeDown, navigation }) {
    const defaultCount = 10;
    const defaultIndex = 0;
    const defaultLastId = 0;
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    const layoutOffset = useRef(0);
    const endScroll = useRef(true);
    const { postList, isPostListLoading, isPendingCreatePost, newCreatePostData, isErrorCreatePost,
         isPendingEditPost, isErrorEditPost, messageEditPost, isPendingDeletePost, isErrorDeletePost, messageDeletePost } = useSelector(
        (state) => state.post
    );
    const { user } = useSelector(
        (state) => state.auth
    );
    const { currentTabIndex } = useSelector(
        (state) => state.tab
    );
    const {userInfor, isLoading} = useSelector((state) => state.user);
    const [postListTotal, setPostListTotal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        if (!isPostListLoading) {
            if (netInfo.isConnected) {
                setPostListTotal([]);
                dispatch(fetchListPost({ lastId: defaultLastId, index: defaultIndex, count: defaultCount }));
            }
            else {
                setPostListTotal(await postService.getListPostsCache());
            }
        }
        await delay(2000);
        setRefreshing(false);
    };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 50;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    const handleOffsetToSwipe = (offsetY) => {
        if (offsetY >= layoutOffset.current) {
            if (onSwipeUp !== undefined && endScroll.current) {
                onSwipeUp();
            }
        }
        else {
            if (onSwipeDown !== undefined && endScroll.current) {
                onSwipeDown();
            }
        }
        layoutOffset.current = offsetY;
    }
    const goToCreatePost = () => {
        dispatch(resetEmojiSlice());
        navigation.navigate('createPost');
    }
    useEffect(() => {
        if (isPendingCreatePost === false && newCreatePostData) {
            let newPostList = [];
            newPostList.push(newCreatePostData);
            console.log(newCreatePostData);
            newPostList = newPostList.concat(postListTotal);
            setPostListTotal(newPostList);
            if (currentTabIndex === 0) ToastAndroid.show("Đăng bài viết thành công", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost());
        }
        if (isErrorCreatePost) {
            if (currentTabIndex === 0) Alert.alert("Đăng bài không thành công", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
            dispatch(resetAddUpdateDeletePost());
        }
        else {
            // popup noti đăng bài thành công
        }
    }, [isPendingCreatePost, newCreatePostData, isErrorCreatePost])
    useEffect(() => {
        if (isErrorEditPost) {
            if (currentTabIndex === 0) ToastAndroid.show("Chỉnh sửa không thành công, vui lòng thử lại sau!", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost());
        }
        else {
            // popup noti chỉnh sửa bài thành công
            if(!isPendingEditPost && messageEditPost){
                if (currentTabIndex === 0) ToastAndroid.show("Chỉnh sửa bài viết thành công", ToastAndroid.SHORT);
                dispatch(resetAddUpdateDeletePost());
                onRefresh();
                //console.log("refesh", isErrorEditPost, isPendingEditPost);
            }
        }
    }, [isPendingEditPost, isErrorEditPost, messageEditPost])
    useEffect(() => {
        if (isErrorDeletePost) {
            if (currentTabIndex === 0) ToastAndroid.show("Có lỗi xảy ra, vui lòng thử lại sau!", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost());
        }
        else {
            // popup noti chỉnh sửa bài thành công
            if(!isPendingDeletePost && messageDeletePost){
                if (currentTabIndex === 0) ToastAndroid.show("Đã chuyển bài viết vào thùng rác", ToastAndroid.SHORT);
                dispatch(resetAddUpdateDeletePost());
                onRefresh();
            }
        }
    }, [isPendingDeletePost, isErrorDeletePost, messageDeletePost])
    useEffect(() => {
        console.log('is', !isPostListLoading);
        dispatch(getUserInfo({ user_id: user.id }));
        if (!isPostListLoading)
            dispatch(fetchListPost({ lastId: defaultLastId, index: defaultIndex, count: defaultCount }));
    }, []);
    useEffect(() => {
        console.log('run', postList?.length);
        let newPostList = postListTotal;
        newPostList = newPostList.concat(postList);
        setPostListTotal(newPostList);
    }, [postList]);
    console.log('newPostList', postListTotal.length);
    return <View style={styles.container}>
        {/* <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#0f80f7"]}
                />}
            onScrollBeginDrag={() => endScroll.current = false}
            onScrollEndDrag={() => endScroll.current = true}
            onScroll={({ nativeEvent }) => {
                handleOffsetToSwipe(nativeEvent.contentOffset.y)
                if (isCloseToBottom(nativeEvent)) {
                    // đã đến cuối trang -> gọi api lấy bài tiếp theo
                    // khi không load nữa
                    if (!isPostListLoading)
                        dispatch(fetchListPost({ lastId: postListTotal[postListTotal.length - 1]?.id, index: defaultIndex + 1, count: defaultCount }));
                }
            }}
            scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
        >
            <View style={{ flex: 1, height: 70, backgroundColor: 'white', flexDirection: 'row', padding: 15 }}>
                <Image style={{ width: 45, height: 45, borderRadius: 45 / 2, borderWidth: 0.5, borderColor: '#ccc' }} source={
                    user?.avatar === null ? require('../../assets/images/default_avatar.jpg') : { uri: user?.avatar }
                } />
                <TouchableOpacity style={{ flex: 1 }} onPress={() => goToCreatePost()}>
                    <TextInput selectTextOnFocus={false}
                        editable={false}
                        style={{
                            flex: 1, borderWidth: 1, placeholderTextColor: 'black',
                            borderColor: '#ccc', height: 40, fontSize: 15, marginTop: 3,
                            marginLeft: 10, borderRadius: 30, paddingLeft: 18
                        }}
                        placeholderTextColor="black"
                        placeholder="Bạn đang nghĩ gì ?"
                    />
                </TouchableOpacity>
            </View>
            {postListTotal?.map((item, index) => {
                console.log(index);
                //if (index === 0) console.log(item.image);
                return <PostInHome navigation={navigation} key={item.id} postData={item} userID={user.id} />
            })}
        </ScrollView> */}
        <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={postListTotal}
            renderItem={(data) => {
                if (data.index === 0) {
                    return <>
                        <View style={{ flex: 1, height: 70, backgroundColor: 'white', flexDirection: 'row', padding: 15 }}>
                            <TouchableOpacity onPress={()=> {
                                navigation.navigate("profile");
                            }}>
                            <Image style={{ width: 45, height: 45, borderRadius: 45 / 2, borderWidth: 0.5, borderColor: '#ccc' }} source={
                                !userInfor?.avatar ? require('../../assets/images/default_avatar.jpg') : { uri: userInfor?.avatar }
                            } />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => goToCreatePost()}>
                                <TextInput selectTextOnFocus={false}
                                    editable={false}
                                    style={{
                                        flex: 1, borderWidth: 1, placeholderTextColor: 'black',
                                        borderColor: '#ccc', height: 40, fontSize: 15, marginTop: 3,
                                        marginLeft: 10, borderRadius: 30, paddingLeft: 18
                                    }}
                                    placeholderTextColor="black"
                                    placeholder="Bạn đang nghĩ gì ?"
                                />
                            </TouchableOpacity>
                        </View>
                        <PostInHome navigation={navigation} key={data.item.id} postData={data.item} userID={user.id} />
                    </>
                }
                return <PostInHome navigation={navigation} key={data.item.id} postData={data.item} userID={user.id} />
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
            onScrollBeginDrag={() => endScroll.current = false}
            onScrollEndDrag={() => endScroll.current = true}
            onScroll={({ nativeEvent }) => {
                handleOffsetToSwipe(nativeEvent.contentOffset.y)
                if (isCloseToBottom(nativeEvent)) {
                    // đã đến cuối trang -> gọi api lấy bài tiếp theo
                    // khi không load nữa
                    if (!isPostListLoading)
                        dispatch(fetchListPost({ lastId: postListTotal[postListTotal.length - 1]?.id, index: defaultIndex + 1, count: defaultCount }));
                }
            }}
            scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
        />
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND
    },
    scrollView: {
        marginHorizontal: 20,
    }
});

export default memo(HomeScreen)