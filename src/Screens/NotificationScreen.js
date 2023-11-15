import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Image, FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import { Entypo, FontAwesome } from '@expo/vector-icons';
function NotificationScreen() {
    const { userList, isLoading } = useSelector(
        (state) => state.user
    );
    const data = [
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 0
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 1
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 2
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 3
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 4
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 5
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 6
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 7
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 8
        },
        {
            avatar: "https://th.bing.com/th/id/OIP.2dQpX0AKTNAGoT95HjWNNAHaDy?pid=ImgDet&rs=1",
            name: "Hưng Nguyễn",
            text: "đã bày tỏ cảm xúc về bài viết của bạn: Hello =))",
            time: "13 thg 11 lúc 22:27",
            backgroundColor: 'rgb(231,243,255)',
            index: 9
        },
    ];
    useEffect(() => {
    }, []);
    return (
        <View>
            <FlatList data={data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    if (item.index === 0) {
                        return (
                            <>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 90, padding: 20}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Thông báo</Text>
                                <View style={{backgroundColor: '#DCDCDC', borderRadius: 30, width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}>
                                <FontAwesome name="search" size={22} color="black" />
                                </View>
                            </View>
                                <TouchableOpacity>
                                <View style={{ flexDirection: 'row', height: 90, justifyContent: 'space-between', backgroundColor: item.backgroundColor }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                        <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }}></Image>
                                        <View style={{ flexDirection: 'column', width: 270, marginLeft: 10 }}>
                                            <Text>
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text>{" " + item.text}</Text>
                                            </Text>
                                            <Text style={{ color: 'gray' }}>{item.time}</Text>
                                        </View>

                                    </View>
                                    <Entypo name="dots-three-horizontal" size={18} color="black" style={{ marginRight: 15, marginTop: 17 }} />
                                </View>
                                </TouchableOpacity>
                            </>
                        );
                    }
                    return (
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', height: 90, justifyContent: 'space-between', backgroundColor: item.backgroundColor }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }}></Image>
                                <View style={{ flexDirection: 'column', width: 270, marginLeft: 10 }}>
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                        <Text>{" " + item.text}</Text>
                                    </Text>
                                    <Text style={{ color: 'gray' }}>{item.time}</Text>
                                </View>

                            </View>
                            <Entypo name="dots-three-horizontal" size={18} color="black" style={{ marginRight: 15, marginTop: 17 }} />
                        </View>
                        </TouchableOpacity>
                    );
                }}>

            </FlatList>
        </View>
    );
}


export default memo(NotificationScreen);
