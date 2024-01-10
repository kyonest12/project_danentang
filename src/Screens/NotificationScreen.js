import React, { useEffect, useState, memo, useRef } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import {
    Text,
    View, Image, FlatList,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import postService from '../Services/Api/postService';
import Notifications from '../Components/Notifications';
import { useNavigation } from '@react-navigation/native';

function NotificationScreen({navigation}) {
    const defaultCount = 8;
    const defaultIndex = useRef(0);
    const dispatch = useDispatch();
    const netInfo = useNetInfo();
    const { user } = useSelector(
        (state) => state.auth
    );
    const [listNoti, setListNoti] = useState([]);
    const [listNotiTotal, setListNotiTotal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingScroll, setLoadingScroll] = useState(false);
    const navi = useNavigation();
    const onRefresh = async () => {
        setRefreshing(true);
        if (!isLoading) {
            if (netInfo.isConnected) {
                handleGetListNoti();
            }
        }
        setRefreshing(false);
    };
    const handleGetListNoti = () => {

        //fix index to user's id

        postService.getNoti("1", defaultCount).then((result) => {
            // console.log(result);
            defaultIndex.current += defaultCount;
            setListNoti(result.data)
            console.log (result.data[0])
        }).catch(e => {
            setListNoti([])
            console.log(e.response.data);
        })
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 50;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    useEffect(() => {
        if (!isLoading) {
            handleGetListNoti()
        }
    }, []);
    useEffect(() => {
        let newList = listNotiTotal;
        newList = newList.concat(listNoti);
        // setListFriendTotal(newList);
        // console.log('*********************',typeof(listNoti[0].type));
        // console.log('*********************',listNoti[1].type);
        setListNotiTotal(listNoti);
    }, [listNoti]);
    function handleScroll(){
        setLoadingScroll(true);
        postService.getNoti(listNotiTotal.length, defaultCount).then((result) => {
            // console.log(result);
            //add to listFriendTotal
            result.data.forEach((item) => {
                listNotiTotal.push(item);
            });
            setLoadingScroll(false);
        }).catch(e => {
            setListNoti([])
            console.log(e.response.data);
            setLoadingScroll(false);
        })
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#0f80f7"]}
                    />}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        handleScroll();
                    }
                }}
                scrollEventThrottle={400}
            >
                <View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
                    <View>
                        {!refreshing && <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            {listNotiTotal.length > 0 ?
                                <>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Thông báo</Text>
                                </>
                                : <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Không có thông báo</Text>
                            }
                        </View>}
                        <View style={{ marginHorizontal: -5 }}>
                            {listNotiTotal?.map((item, index) => {
                                return <View key={index} >
                                    <Notifications navigation={navigation} data={item} updateListNoti={() => handleGetListNoti()} />
                                </View>
                            })}
                        </View>
                        <View style={{marginVertical: '50'}}>
                            {
                                loadingScroll && (<ActivityIndicator size={50} color="#0000ff" />)
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


export default memo(NotificationScreen);
