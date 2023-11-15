import { Text, TextInput, View, Button, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, FlatList } from "react-native";
import { useState, useEffect, memo, useRef } from "react";
import { deepCopy, onlyNumber, _getCache, _setCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, SafeAreaView } from "react-native";
import { fetchListPost } from "../Redux/postSlice";
import postService from '../Services/Api/postService';
import { delay } from '../Services/Helper/common';
import { useNetInfo } from '@react-native-community/netinfo';
import { COMMON_COLOR } from "../Services/Helper/constant";
import { resetEmojiSlice } from "../Redux/emojiSlice";
import VideoDetail from "../Components/VideoDetail";
//@trungtt123
function AnotherVideoScreen({ navigation, route }) {
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
    const [postListTotal, setPostListTotal] = useState([]);
    useEffect(() => {
        setPostListTotal([route.params?.postData]);
    }, [route.params?.postData])
    return <View style={styles.container}>
        <View style={{marginTop: 30}}>
            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={postListTotal}
                renderItem={(data) => {
                    return <VideoDetail
                        isPlaying={true}
                        videoStyles={{
                            backgroundColor: '#333436',
                            textColor: 'white'
                        }}
                        navigation={navigation} key={data.item.id} postData={data.item} />
                }}
                // Performance settings
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={1} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
                scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
            />
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242527'
    },
    scrollView: {
        marginHorizontal: 20,
    }
});

export default memo(AnotherVideoScreen)