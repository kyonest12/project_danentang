import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    View,
    Image,
    Dimensions,
    ScrollView,
    ToastAndroid,
    RefreshControl,
    Alert
} from 'react-native';
import { SimpleGrid } from 'react-native-super-grid';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import CommentModal from '../Components/modal/CommentModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { FontAwesome5, FontAwesome, AntDesign, Fontisto } from 'react-native-vector-icons';
import ModalBottom from 'react-native-modalbox';
import {
    delay,
    _getCache,
    _setCache
} from '../Services/Helper/common';
import styles from './style/profile';
import postService from '../Services/Api/postService';
import userService from '../Services/Api/userService';
import PostInHome from "../Components/PostInHome";
import { resetEmojiSlice } from '../Redux/emojiSlice';
import { resetAddUpdateDeletePost } from '../Redux/postSlice';

function ProfileScreen({ navigation, route }) {
    const dispatch = useDispatch();
    const { width } = Dimensions.get('window');
    const { userList, isLoading } = useSelector(
        (state) => state.user
    );

    const { postList, isPostListLoading, isPendingCreatePost, newCreatePostData, isErrorCreatePost,
        isPendingEditPost, isErrorEditPost, messageEditPost, isPendingDeletePost, isErrorDeletePost, messageDeletePost } = useSelector(
            (state) => state.post
        );

    let av = "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-13.jpg";
    const userId = route?.params?.userId;

    const [showModalAva, setShowModalAva] = useState(false);
    const [showModalCover, setShowModalCover] = useState(false);
    const [listPost, setListPost] = useState([]);
    const [friends, setFriends] = useState([]);
    const [cntFriend, setCntFriend] = useState(0);
    const { user } = useSelector(
        (state) => state.auth
    );
    const { currentTabIndex } = useSelector(
        (state) => state.tab
    );
    const [refreshing, setRefreshing] = useState(false);
    const [reload, setReload] = useState(false);
    const { userInfor, successChangeAva } = useSelector((state) => state.user);
    // console.log(userInfor);
    const [userInfors, setUserInfors] = useState(userInfor);
    const onRefresh = async () => {
        setRefreshing(true);
        handleGetData();
        await delay(2000);
        setRefreshing(false);
    }
    const handleGetData = () => {
        postService.getListPostByUserId(userId ? userId : user.id).then((result) => {
            setListPost(result.data);
        }).catch(e => {
            console.log(e);
        });
        
        if (userId) {
            userService.getUserInfor(userId).then((result) => {
                setUserInfors(result.data);
            }).catch(e => {
                console.log(e);
            });
            userService.getUserFriends(userId, 0, 5).then((result) => {
                console.log(result);
                setCntFriend(result.data.friends.length);
                setFriends(result.data.friends.slice(0, 6));
            }).catch(e => {
                console.log(e);
            });
        }
    }
    useEffect(() => {
        handleGetData();
    }, [reload, userId])

    useEffect(() => {
        if (isPendingCreatePost === false && isErrorCreatePost === false) {
            if (currentTabIndex === 3) ToastAndroid.show("Đăng bài viết thành công", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost())
            onRefresh();
        }
        if (isErrorCreatePost) {
            dispatch(resetAddUpdateDeletePost())
            if (currentTabIndex === 3) Alert.alert("Đăng bài không thành công", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => null }
            ]);
        }
        else {
            // popup noti đăng bài thành công
        }
    }, [isPendingCreatePost, newCreatePostData, isErrorCreatePost])
    useEffect(() => {
        if (isErrorEditPost === true) {
            if (currentTabIndex === 3) ToastAndroid.show("Chỉnh sửa không thành công, vui lòng thử lại sau!", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost())
        }
        if (isErrorEditPost === false) {
            // popup noti chỉnh sửa bài thành công
            if (isPendingEditPost === false && messageEditPost) {
                if (currentTabIndex === 3) ToastAndroid.show("Chỉnh sửa bài viết thành công", ToastAndroid.SHORT);
                dispatch(resetAddUpdateDeletePost())
                onRefresh();
                //console.log("refesh", isErrorEditPost, isPendingEditPost);
            }
        }
    }, [isPendingEditPost, isErrorEditPost, messageEditPost])
    useEffect(() => {
        if (isErrorDeletePost) {
            if (currentTabIndex === 3) ToastAndroid.show("Có lỗi xảy ra, vui lòng thử lại sau!", ToastAndroid.SHORT);
            dispatch(resetAddUpdateDeletePost())
        }
        else if (isErrorDeletePost === false){
            // popup noti chỉnh sửa bài thành công
            if (isPendingDeletePost === false && messageDeletePost) {
                if (currentTabIndex === 3) ToastAndroid.show("Đã chuyển bài viết vào thùng rác", ToastAndroid.SHORT);
                dispatch(resetAddUpdateDeletePost())
                onRefresh();
            }
        }
    }, [isPendingDeletePost, isErrorDeletePost, messageDeletePost])

    const showModalAvatar = () => {
        setShowModalAva(true);
    }
    return (
        <>
            {!userId ?
                <>
                    <ModalBottom
                        backdropPressToClose={true}
                        isOpen={showModalAva}
                        style={styles.modalBox}
                        onClosed={() => setShowModalAva(false)}
                    >
                        <View style={styles.contentAva}>
                            <View style={styles.rowModal}>
                                <View style={styles.iconModal}>
                                    <MaterialIcons name='filter-frames' size={25} />
                                </View>
                                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                    Thêm khung
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('pickAvatar')}
                            >
                                <View style={styles.rowModal}>
                                    <View style={styles.iconModal}>
                                        <FontAwesome5 name='images' size={25} />
                                    </View>
                                    <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                        Chọn ảnh đại diện
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.rowModal}>
                                <View style={styles.iconModal}>
                                    <FontAwesome5 name='user-circle' size={25} />
                                </View>
                                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                    Xem ảnh đại diện
                                </Text>
                            </View>
                        </View>
                    </ModalBottom>

                    <ModalBottom
                        backdropPressToClose={true}
                        isOpen={showModalCover}
                        style={styles.modalBox}
                        onClosed={() => setShowModalCover(false)}
                    >
                        <View style={styles.contentCover}>
                            <View style={styles.rowModal}>
                                <View style={styles.iconModal}>
                                    <FontAwesome5 name='image' size={25} />
                                </View>
                                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                    Xem  ảnh bìa
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('pickCover')}
                            >
                                <View style={styles.rowModal}>
                                    <View style={styles.iconModal}>
                                        <FontAwesome name='upload' size={25} />
                                    </View>
                                    <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                        Tải ảnh lên
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.rowModal}>
                                <View style={styles.iconModal}>
                                    <MaterialCommunityIcons name='facebook' size={25} />
                                </View>
                                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                    Chọn ảnh trên facebook
                                </Text>
                            </View>
                            <View style={styles.rowModal}>
                                <View style={styles.iconModal}>
                                    <AntDesign name='appstore1' size={25} />
                                </View>
                                <Text style={{ fontSize: 20, marginTop: 5, fontWeight: '500' }}>
                                    Tạo nhóm ảnh bìa
                                </Text>
                            </View>
                        </View>
                    </ModalBottom>
                </> : <></>
            }
            <ScrollView showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#0f80f7"]}
                    />}
            >
                <View style={styles.firstView}>
                    <TouchableOpacity
                        onPress={() => setShowModalCover(true)}
                    >
                        <Image source={(userId ? !userInfors?.cover_image : !userInfor?.cover_image) ? require('../../assets/images/default_avatar.jpg') : { uri: userId ? userInfors?.cover_image : userInfor?.cover_image }} style={styles.coverImage} />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        <TouchableOpacity
                            onPress={() => showModalAvatar()}
                        >
                            <Image source={(userId ? !userInfors?.avatar : !userInfor?.avatar) ? require('../../assets/images/default_avatar.jpg') : { uri: userId ? userInfors?.avatar : userInfor?.avatar }} style={styles.avatarImg} />
                        </TouchableOpacity>
                        <Text style={styles.name}>
                            {userInfors?.username}
                        </Text>
                        <TouchableOpacity onPress={() => { 
                            if(userId){
                                navigation.navigate('chatscreen', { userId: userId, userName: userInfors?.username, avatar: userInfors?.avatar })
                            }
                         }}
                            style={styles.addNews}>
                            {userId ? <Fontisto name="messenger" size={20} color="#ffffff" /> : <Icon name="add-circle-sharp" size={20} color="#ffffff" />}

                            {userId ? (<Text style={styles.addNewsText} >Nhắn tin</Text>) : (<Text style={styles.addNewsText} >Thêm vào tin</Text>)}

                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', width: 0.9 * width }}>
                        {userId ? (
                                <TouchableOpacity
                                onPress={() => {}}
                                style={styles.editInfor}
                            >
                                <View style={styles.editInfor}>
                                <FontAwesome5 name="user-check" size={20} color="black" />
                                    <Text style={styles.editText}>
                                        {'Bạn bè'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            ): (
                                <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('editProfile');
                                }}
                                style={styles.editInfor}
                            >
                                <View style={styles.editInfor}>
                                <MaterialCommunityIcons name="pencil" size={20} color='#000000' />
                                    <Text style={styles.editText}>
                                        {'Chỉnh sửa trang cá nhân'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.setting}
                                onPress={() => navigation.navigate('setting', {userId: userId})}
                            >
                                <View>
                                    <MaterialIcons name="more-horiz" size={20} color='#000000' />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.secondView}>
                    <Text style={styles.title}>
                        Chi tiết
                    </Text>
                    <Text style={styles.description}>
                        {userInfors?.description}
                    </Text>
                    {/* <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Học tại
                        </Text>
                        <Text style={styles.data} numberOfLines={2}>
                            Đại học Bách Khoa Hà Nội
                        </Text>
                    </View>
                    <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Từng học tại
                        </Text>
                        <Text style={styles.data}>
                            Đại học Bách Khoa Hà Nội
                        </Text>
                    </View>
                    <View style={styles.rowInfor}>
                        <MaterialCommunityIcons name='school' size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Đã học tại
                        </Text>
                        <Text style={styles.data}>
                            Tôi yêu bách khoa
                        </Text>
                    </View> */}
                    {
                        (userId ? userInfors.city : userInfor.city) ?
                            <View style={styles.rowInfor}>
                                <Icon name='home-sharp' size={25} color='#909698' />
                                <Text style={styles.hardTextAddress}>
                                    Sống tại
                                </Text>
                                <Text style={styles.data}>
                                    {userId ? userInfors.address : userInfor.address}
                                </Text>
                            </View>
                            : <View></View>
                    }
                    {
                        (userId ? userInfors.address : userInfor.address) ?
                            <View style={styles.rowInfor}>
                                <FontAwesome5 name='map-marker-alt' size={25} color='#909698' />
                                <Text style={styles.hardTextCountry}>
                                    Đến từ
                                </Text>
                                <Text style={styles.data}>
                                    {userInfors?.city}
                                </Text>
                            </View>
                            : <View></View>
                    }
                    {
                        (userId ? userInfors.country : userInfor.country) ?
                            <View style={styles.rowInfor}>
                                <FontAwesome5 name='map-marker-alt' size={25} color='#909698' />
                                <Text style={styles.hardTextCountry}>
                                    Đến từ
                                </Text>
                                <Text style={styles.data}>
                                    {userInfors?.country}
                                </Text>
                            </View>
                            : <View></View>
                    }
                    {
                        (userId ? userInfors.link : userInfor.link) ?
                            <View style={styles.rowInfor}>
                                <FontAwesome5 name='link' size={25} color='#909698'/>
                                <Text style={styles.data}>
                                    {userInfors?.link}
                                </Text>
                            </View>
                            : <View></View>
                    }
                    <View style={styles.rowInfor}>
                        <MaterialIcons name="more-horiz" size={27} color='#909698' />
                        <Text style={styles.hardTextAddress}>
                            Xem thông tin giới thiệu của bạn
                        </Text>
                    </View>
                    {!userId && <TouchableOpacity
                        onPress={() => navigation.navigate('editProfile')}
                    >
                        <View style={styles.editPublicInfor}>
                            <Text style={styles.textEditPublic}>
                                Chỉnh sửa chi tiết công khai
                            </Text>
                        </View>
                    </TouchableOpacity>}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.title}>
                            Bạn bè
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('allfriend', {
                            title: userInfors?.username,
                            targetUserId: userInfors?.id
                        })}>
                            <Text  style={styles.titleButton}>Tìm bạn bè</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 18, color: '#7a7c7d', marginTop: 5 }}>
                        {`${cntFriend} người bạn`}
                    </Text>
                    <SimpleGrid
                        data={friends}
                        spacing={2}
                        renderItem={({ item }) => (
                            <Friend data={item} navigation={navigation} userId={user?.id}/>
                        )}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('allfriend', {
                        title: userInfors?.username,
                        targetUserId: userInfors?.id
                    })}
                        style={{
                            marginTop: 20,
                            marginBottom: 20,
                            backgroundColor: '#E4E6EB',
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderRadius: 5
                        }}>
                        <Text style={styles.editText}>
                            Xem tất cả bạn bè
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.thirdView}>
                    <Text style={styles.titleThird}>
                        Bài viết
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(resetEmojiSlice());
                            navigation.navigate('createPost');
                        }}
                    >
                        <View style={styles.thinking}>
                            <Image source={(userId ? !userInfors?.avatar : !userInfor.avatar) ? require('../../assets/images/default_avatar.jpg') : { uri: userId ? userInfors?.avatar : userInfor?.avatar }} style={styles.postImage} />
                            <Text style={styles.thinkText}>
                                Bạn đang nghĩ gì?
                            </Text>
                            <View style={styles.imageIcon}>
                                <FontAwesome5 name='images' size={25} color='#61ec84' />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {listPost?.map((item, index) => {
                    return <PostInHome navigation={navigation} key={item.id} postData={item} avatar={(userId ? !userInfors?.avatar : !userInfor.avatar) ? require('../../assets/images/default_avatar.jpg') : { uri: userId ? userInfors?.avatar : userInfor?.avatar }} userID={user.id} />
                })}
            </ScrollView>
        </>
    );
}

function Friend({ data, navigation, userId }) {
    return (
        <TouchableOpacity onPress={() => {
            if(userId != data?.id){
                navigation.navigate("profile", { userId: data?.id });
            }
        }}>
            <View style={styles.friendCard}>
                <Image source={!data?.avatar ? require('../../assets/images/default_avatar.jpg') : { uri: data?.avatar }} style={styles.imageFr} />
                <Text style={{ marginStart: 5, fontSize: 18, fontWeight: '500' }}>
                    {data?.username}
                </Text>
            </View>
        </TouchableOpacity>
    );
}


export default memo(ProfileScreen);
