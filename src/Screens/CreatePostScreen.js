import React, { useEffect, useState, memo, Component, useRef } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    Keyboard,
    StatusBar,
    ScrollView,
    Modal,
    Button,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import Icon from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av';
import axios from '../setups/custom_axios';
import { createPost } from '../Redux/postSlice';

export default function CreatePostScreen({ route, navigation }) {
    const prevPage = useRef(route.params?.prevPage);
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { user } = useSelector(
        (state) => state.auth
    );
    const checkEmoji = useSelector((state) => state.emoji.checkEmoji);
    const textEmoji = useSelector((state) => state.emoji.textEmoji);
    const iconEmoji = useSelector((state) => state.emoji.iconEmoji);
    const data = useSelector((state) => state.emoji.data);
    const checkImage = useSelector((state) => state.emoji.checkImage);
    const checkVideo = useSelector((state) => state.emoji.checkVideo);

    const getType = (filename) => {
        return filename.split('.').pop();
    }
    useEffect(() => {
        prevPage.current = route.params?.prevPage;
    }, [route])
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Tạo bài viết</Text>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => { postData(); navigation.goBack() }}
                    style={{ backgroundColor: '#365899', borderRadius: 10, width: 50, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>Đăng</Text>
                </TouchableOpacity>)
        })
    }, [navigation, text, textEmoji, checkEmoji, iconEmoji, data, checkImage, checkVideo]);
    const postData = () => {
        let formData = new FormData();
        let status = textEmoji;
        let described = text;
        if (data.length > 0 && checkImage) {
            for (let i = 0; i < data.length; i++) {
                formData.append("image", { name: data[i].filename, uri: data[i].uri, type: 'image/' + getType(data[i].filename) })
            }
            //formData.append("image", assets);
        } else if (data.length > 0 && checkVideo) {
            formData.append("video", { name: data[0].filename, uri: data[0].uri, type: 'video/' + getType(data[0].filename) })
        }
        // check xem người dùng đã nhập các thông tin tối thiểu hay chưa
        dispatch(createPost({described, status, formData, isMedia: (checkImage || checkVideo)}));
    }

    return (
        <View style={{ backgroundColor: 'white', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}>
                <Image source={user?.avatar === null ? require('../../assets/images/default_avatar.jpg') : { uri: user?.avatar }} style={styles.img} />
                <View style={{ paddingLeft: 8 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'black', fontWeight: '600' }}>{user?.username}</Text>
                        {(checkEmoji) ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: iconEmoji }} style={styles.emoji} />
                                <Text>{' đang cảm thấy '}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{textEmoji}</Text>
                            </View>) : null
                        }
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            padding: 2, paddingLeft: 4, paddingRight: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            marginTop: 4, borderColor: '#D3D6DB', borderWidth: 1, borderRadius: 5
                        }}>
                            <Icon name="md-globe" color={'gray'} />
                            <Text style={{ color: 'gray', marginLeft: 4, marginRight: 4 }}>Công khai</Text>
                            <Icon name='caret-down' color={'gray'} size={16} />
                        </View>
                    </View>
                </View>
            </View>


            <TextInput autoFocus={true} multiline style={{ height: 60, fontSize: 16, padding: 16, paddingTop: 0 }} selectionColor={'gray'} placeholderTextColor={'gray'} placeholder={"Bạn đang nghĩ gì?"} defaultValue={text} onChangeText={newText => setText(newText)} />


            <View style={{ justifyContent: 'center', alignContent: 'center', backgroundColor: 'white', height: 400, flexDirection: 'row', }}>
                {(checkImage && data.length == 1) ? (
                    data.map((item, i) => {
                        return (
                            <View style={{ flex: 1 }} key={i}>
                                <Image source={{ uri: item.uri }} style={styles.image} />
                            </View>
                        );
                    })) : null}
                {(checkImage && data.length == 2) ? (
                    data.map((item, i) => {
                        return (
                            <View style={{ flex: 1, width: '50%', height: '100%', }} key={i}>
                                <Image source={{ uri: item.uri }} style={styles.image} />
                            </View>
                        );
                    })) : null}
                {(checkImage && data.length == 3) ? (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Image source={{ uri: data[0].uri }} style={styles.firstImage} />
                        <View style={{ flex: 1, width: '50%' }}>
                            <Image source={{ uri: data[1].uri }} style={styles.secondImage} />
                            <Image source={{ uri: data[2].uri }} style={styles.secondImage} />
                        </View>
                    </View>

                ) : null}
                {(checkImage && data.length == 4) ? (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Image source={{ uri: data[0].uri }} style={styles.firstImage} />
                        <View style={{ flex: 1, width: '50%' }}>
                            <Image source={{ uri: data[1].uri }} style={styles.thirdImage} />
                            <Image source={{ uri: data[2].uri }} style={styles.thirdImage} />
                            <Image source={{ uri: data[3].uri }} style={styles.thirdImage} />
                        </View>
                    </View>
                ) : null}
                {(checkVideo) ? (
                    <Video source={{ uri: data[0].uri }} style={{ flex: 1, alignSelf: 'stretch' }}
                        useNativeControls
                    >
                    </Video>
                ) : null}
            </View>
            <View>
                <TouchableOpacity onPress={() => { navigation.navigate("image") }}>
                    <View style={{
                        flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                        borderTopColor: '#72757A', borderTopWidth: StyleSheet.hairlineWidth
                    }}>
                        <Icon name="md-camera" color='green' size={24} />
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16 }}>Ảnh/Video</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("emoji")
                }}>
                    <View style={{
                        flexDirection: 'row', height: 56, alignItems: 'center', paddingLeft: 16,
                        borderTopColor: '#72757A', borderTopWidth: StyleSheet.hairlineWidth
                    }}>
                        <Icon name="happy-outline" color='#EDC370' size={24} />
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: '500', paddingLeft: 16 }}>Cảm xúc</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    img: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    emoji: {
        marginLeft: 5,
        width: 20,
        height: 20,
        borderRadius: 50,
        marginBottom: 5
    },

    icon: {
        marginLeft: 10
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: "white",
        overflow: "hidden",
    },
    firstImage: {
        flex: 1,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: "white",

        overflow: "hidden",
        width: '50%'
    },
    secondImage: {
        flex: 1,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: "white",
        overflow: "hidden",
        height: '50%'
    },
    thirdImage: {
        flex: 1,
        height: '33%',
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: "white",
        overflow: "hidden",
    },

});
