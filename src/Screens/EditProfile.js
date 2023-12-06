import {View, Button, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import CommentModal from '../Components/modal/CommentModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialIcons } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {FontAwesome5} from 'react-native-vector-icons';
import {getUserInfo} from '../Redux/userInforSlice';
import styles from './style/edit';
import { WebView } from 'react-native-webview';
import userService from '../Services/Api/userService';

function EditProfileScreen ({navigation}) {
    const editTitle = 'Chỉnh sửa';
    const dispatch = useDispatch();
    const {userInfor, isLoading} = useSelector((state) => state.user);
    console.log('dataEdit: ', userInfor);
    //open web view
    function openWebView(url) {
        console.log('open web view');
        return (
            <WebView source={{ uri: url }} style={{ flex: 1 }} />
        );
    }

    return <ScrollView style={styles.container}>
        <View style={styles.editAvatar}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Ảnh đại diện
                </Text>
                <TouchableOpacity
                onPress={() => navigation.navigate('pickAvatar')}
                >
                    <Text style={styles.titleButton}>
                        {editTitle}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                        source={userInfor?.avatar === null? require('../../assets/images/default_avatar.jpg'): {uri: userInfor.avatar}}
                        style={styles.avatar}
                    />
            </View>
        </View>
        <View style={styles.editCover}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Ảnh bìa
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('pickCover')}
                >
                    <Text style={styles.titleButton}>
                        {editTitle}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Image
                        source={userInfor?.cover_image === null? require('../../assets/images/default_avatar.jpg'): {uri: userInfor.cover_image}}
                        style={styles.cover}
                        resizeMode='cover'
                    />
            </View>
        </View>
        <View style={styles.description}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Tiểu sử
                </Text>
                <TouchableOpacity
                    onPress={()=> navigation.navigate('editDescription')}
                >
                    <Text style={styles.titleButton}>
                        Chỉnh sửa
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={()=> navigation.navigate('editDescription')}
                >
                    <Text style={styles.descriptionTitle}>
                        {userInfor?.description === null ? 'Mô tả bản thân...' : userInfor?.description }
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.publicInfor}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Chi tiết
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('editPublicInfo')}
                >
                    <Text style={styles.titleButton}>
                        {editTitle}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                {/* <View style={styles.rowInfor}>
                    <MaterialCommunityIcons name='school' size={27} color='#909698'/>
                    <Text style={styles.hardTextAddress}>
                        Học tại
                    </Text>
                    <Text style={styles.hardTextAddress} numberOfLines={2}>
                        Đại học Bách Khoa Hà Nội
                    </Text>
                </View> */}
                {/* <View style={styles.rowInfor}>
                    <MaterialCommunityIcons name='school' size={27} color='#909698'/>
                    <Text style={styles.hardTextAddress}>
                        Từng học tại
                    </Text>
                    <Text style={styles.hardTextAddress}>
                        Đại học Bách Khoa Hà Nội
                    </Text>
                </View> */}
                {/* <View style={styles.rowInfor}>
                    <MaterialCommunityIcons name='school' size={27} color='#909698'/>
                    <Text style={styles.hardTextAddress}>
                        Đã học tại
                    </Text>
                    <Text style={styles.hardTextAddress}>
                        Tôi yêu bách khoa
                    </Text>
                </View> */}
                <View style={styles.rowInfor}>
                    <Icon name='home-sharp' size={25} color='#909698'/>
                    <Text style={styles.hardTextCountry}>
                        Sống tại
                    </Text>
                    <Text style={styles.hardTextAddress}>
                        {userInfor.city}
                    </Text>
                </View>
                <View style={styles.rowInfor}>
                    <FontAwesome5 name='map-marker-alt' size={25} color='#909698'/>
                    <Text style={styles.hardTextCountry}>
                        Đến từ
                    </Text>
                    <Text style={styles.hardTextAddress}>
                        {userInfor.country}
                    </Text>
                </View>
                <View style={styles.rowInfor}>
                    <FontAwesome5 name='link' size={25} color='#909698'/>
                    <Text style={styles.hardTextLink} onPress={() => openWebView(userInfor.link)}>
                        {userInfor.link}
                    </Text>
                </View>
                <View style={styles.rowInfor}>
                    <FontAwesome5 name='wifi' size={18} style={{transform: [{rotate: '45deg'}]}} color='#A3a4a4'/>
                    <Text style={styles.hideText}>
                        Có 91 người theo dõi
                    </Text>
                </View>
            </View>
        </View>
        <View style={styles.favorite}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Sở thích
                </Text>
                <TouchableOpacity>
                    <Text style={styles.titleButton}>
                        Thêm
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        {/* <View style={styles.favorite}>
            <View style={styles.titleAvatars}>
                <Text style={styles.title}>
                    Liên kết
                </Text>
                <TouchableOpacity>
                    <Text style={styles.titleButton}>
                        Thêm
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.rowInfor}>
                    <FontAwesome5 name='link' size={25} color='#909698'/>
                    <Text style={styles.hardTextLink}>
                        {userInfor.link}
                    </Text>
                </View>
            </View>
        </View> */}
        <View style={styles.editInforButton}>
            <TouchableOpacity onPress={() => {
                
            }}>
                <FontAwesome5 name='user-minus' color='#3488f4'/>
                <Text style={{color: '#3488f4', marginStart: 5, fontSize: 18}}>
                    Chỉnh sửa thông tin giới thiệu
                </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
}
export default EditProfileScreen;