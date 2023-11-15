import React, { useEffect, useState, memo, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    View,
    ScrollView,
    RefreshControl,
    Image,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import { COMMON_COLOR } from '../Services/Helper/constant';
import { Feather, Fontisto, Entypo, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import userService from '../Services/Api/userService';
import { delay, getTimeSendRequestFriend } from '../Services/Helper/common';
import MyFriend from '../Components/MyFriend';
function AllFriendScreen({ route, navigation }) {
    const title = route.params?.title;
    const targetUserId = route.params?.targetUserId;
    const showFilterTab = route.params?.showFilterTab;
    const showSearchFriend = route.params?.showSearchFriend;
    const defaultCount = 1;
    const defaultIndex = useRef(0);
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    const { user } = useSelector(
        (state) => state.auth
    );
    const [listFriend, setListFriend] = useState([]);
    const [listFriendTotal, setListFriendTotal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        if (!isLoading) {
            if (netInfo.isConnected) {
                handleGetListRequest();
                //dispatch(fetchListPost({ lastId: defaultLastId, index: defaultIndex, count: defaultCount }));
            }
        }
        // await delay(2000);
        setRefreshing(false);
    };
    const handleGetListRequest = () => {
        userService.getUserFriends(targetUserId, defaultIndex.current, defaultCount).then((result) => {
            defaultIndex.current += defaultCount;
            setListFriend(result.data.friends)
        }).catch(e => {
            setListFriend([])
            console.log(e);
        })
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 50;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    useEffect(() => {
        if (!isLoading) {
            handleGetListRequest()
        }
    }, []);
    useEffect(() => {
        let newList = listFriendTotal;
        newList = newList.concat(listFriend);
        // setListFriendTotal(newList);
        setListFriendTotal(listFriend);
    }, [listFriend]);
    useEffect(() => {
        navigation.setOptions({
            title: title,
            headerRight: () => (
                <View style={styles.btnRight}>
                    <FontAwesome onPress={() => navigation.navigate('search')}
                        style={{ left: 1 }} name="search" size={22} color="black" />
                </View>
            )
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
            {showFilterTab && <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, width: '100%', flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ padding: 8, paddingHorizontal: 10, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: -1, marginLeft: -1, fontSize: 15 }}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('allfriend',
                        {
                            title: 'Tất cả bạn bè'
                        })}
                        style={{ marginLeft: 5, padding: 8, paddingHorizontal: 10, borderRadius: 20, backgroundColor: COMMON_COLOR.GRAY_COLOR_BACKGROUND }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: -1, marginLeft: -1, fontSize: 15 }}>Gần đây</Text>
                    </TouchableOpacity>
                </View>
            </View>}

            <ScrollView showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#0f80f7"]}
                    />}
                onScroll={({ nativeEvent }) => {
                    // if (isCloseToBottom(nativeEvent)) {
                    //     // đã đến cuối trang -> gọi api lấy bài tiếp theo
                    //     // khi không load nữa
                    //     if (!isLoading)
                    //         handleGetListRequest(defaultIndex.current, defaultCount);
                    // }
                }}
                scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
            >
                <View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
                    <View>
                        {!refreshing && <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            {listFriendTotal.length > 0 ?
                                <>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{`${listFriendTotal?.length} người bạn`}</Text>
                                </>
                                : <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Không có bạn bè</Text>
                            }
                        </View>}
                        <View style={{ marginHorizontal: -5 }}>
                            {listFriendTotal?.map((item, index) => {
                                return <View key={index} >
                                    <MyFriend navigation={navigation} data={item} updateListFriends={() => handleGetListRequest()} />
                                </View>
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    btnRight: {
        backgroundColor: '#f1f2f4',
        padding: 5,
        borderRadius: 20,
        marginLeft: 10,
        marginTop: -1,
        marginRight: -5,
        width: 32,
        height: 32
    },
});
export default memo(AllFriendScreen);
