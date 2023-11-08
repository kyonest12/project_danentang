import { Text, TextInput, View, Button, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, memo, useRef } from "react";
import { deepCopy, onlyNumber, _getCache, _setCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, SafeAreaView } from "react-native";
import { fetchListPost } from "../Redux/postSlice";
import postService from '../Services/Api/postService';
import { delay } from '../Services/Helper/common';
import PostInHome from "../Components/PostInHome";
import { useNetInfo } from '@react-native-community/netinfo';
import { COMMON_COLOR } from "../Services/Helper/constant";
import { resetData } from "../Redux/emojiSlice";
//@trungtt123
function HomeScreen({ route, onSwipeUp, onSwipeDown, navigation }) {
    const defaultCount = 4;
    const defaultIndex = 0;
    const defaultLastId = 0;
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    const layoutOffset = useRef(0);
    const endScroll = useRef(true);
    const { postList, isPostListLoading, isPendingCreatePost, newCreatePostData, isErrorCreatePost } = useSelector(
        (state) => state.post
    );
    const { user } = useSelector(
        (state) => state.auth
    );
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
        dispatch(resetData());
        navigation.navigate('createPost');
    }
    useEffect(() => {
        if (!isPendingCreatePost && newCreatePostData) {
            let newPostList = [];
            newPostList.push(newCreatePostData);
            console.log(newCreatePostData);
            newPostList = newPostList.concat(postListTotal);
            setPostListTotal(newPostList);
        }
        if (isErrorCreatePost) {
            Alert.alert("Đăng bài không thành công", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        }
        else {
            // popup noti đăng bài thành công
        }
    }, [isPendingCreatePost, newCreatePostData, isErrorCreatePost])
    useEffect(() => {
        console.log('is', !isPostListLoading);
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
        <ScrollView showsVerticalScrollIndicator={false}
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
                return <PostInHome navigation={navigation} key={item.id} postData={item} />
            })}
        </ScrollView>
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