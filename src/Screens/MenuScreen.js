import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    Image,
    ScrollView,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import { logout, resetAuthSlice } from "../Redux/authSlice";
import { resetPostSlice } from '../Redux/postSlice';
import {resetUserInfor, resetUserSlice} from '../Redux/userSlice'
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { COMMON_COLOR } from '../Services/Helper/constant';
import { resetEmojiSlice } from '../Redux/emojiSlice';
import { setUserID } from '../Redux/emojiSlice';
import { resetTabSlice } from '../Redux/tabSlice';
import { resetUserInfoSlice } from '../Redux/userInforSlice';
import { resetVideoSlice } from '../Redux/videoSlice';
function MenuScreen({ navigation }) {
    const dispatch = useDispatch();
    const { userInfor } = useSelector(state => state.user);
    const [isShowHelp, setIsShowHelp] = useState(false);
    const [isShowSetting, setIsShowSetting] = useState(false);
    const handleLogout = () => {
        // reset store
        dispatch(resetPostSlice());
        dispatch(resetAuthSlice());
        dispatch(resetEmojiSlice());
        dispatch(resetTabSlice());
        dispatch(resetUserSlice());
        dispatch(resetUserInfoSlice());
        dispatch(resetVideoSlice());
        dispatch(logout());
    }
    const handleExitApp = () => {
        BackHandler.exitApp();
    }
    return (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#f2f3f5', paddingTop: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Menu</Text>
                <TouchableOpacity onPress={() => navigation.navigate('search')}
                    style={{ borderRadius: 20, backgroundColor: 'white', padding: 5 }}>
                    <MaterialIcons name="search" size={25} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 25, paddingHorizontal: 10 }}>
                <Image style={{ width: 35, height: 35, borderRadius: 45 / 2, borderWidth: 0.5, borderColor: '#ccc' }} source={
                    !userInfor?.avatar ? require('../../assets/images/default_avatar.jpg') : { uri: userInfor?.avatar }
                } />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{userInfor?.username}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("profile")}>
                        <Text style={{ fontSize: 15, color: COMMON_COLOR.GRAY_TEXT_COLOR, top: -2 }}>Xem trang cá nhân của bạn</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', height: 400, paddingHorizontal: 10 }}>
                <View style={{ flex: 1, flexDirection: 'column', marginRight: 3 }}>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-ban-be.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Tìm kiếm bạn bè</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-ki-niem.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Kỷ niệm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-da-luu.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Đã lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-hen-ho.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Hẹn hò</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-choi-game.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Chơi game</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginRight: 3 }}>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-nhom.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Nhóm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-watch.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Video trên Watch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-trang.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Trang</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-su-kien.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sự kiện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={{ width: 30, height: 30 }}
                            source={require('../../assets/icons/icon-viec-lam.png')} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Việc làm</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: '#e7e8ea', marginVertical: 10 }}>
                <View style={{
                    paddingHorizontal: 10, flexDirection: 'column',
                    borderColor: '#d8d9de', borderTopWidth: 1, justifyContent: 'center', minHeight: 45
                }}>
                    <TouchableOpacity onPress={() => {
                        setIsShowHelp(!isShowHelp);
                        setIsShowSetting(false);
                    }}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name='help-outline' size={25} />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, top: 3 }}>Trợ giúp & Hỗ trợ</Text>
                        </View>
                        <Feather name={isShowHelp ? 'chevron-up' : 'chevron-down'} size={20} style={{ top: 3 }} />
                    </TouchableOpacity>
                    {
                        isShowHelp && <>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Trung tâm trợ giúp</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Hộp thư hỗ trợ</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Cộng đồng trợ giúp</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Báo cáo sự cố</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Điều khoản & chính sách</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    }
                </View>
                <View style={{
                    paddingHorizontal: 10, flexDirection: 'column',
                    borderColor: '#d8d9de', borderTopWidth: 1, justifyContent: 'center',
                    minHeight: 45
                }}>
                    <TouchableOpacity onPress={() => {
                        setIsShowSetting(!isShowSetting);
                        setIsShowHelp(false);
                    }}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name='settings' size={25} />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, top: 3 }}>Cài đặt & quyền riêng tư</Text>
                        </View>
                        <Feather name={isShowSetting ? 'chevron-up' : 'chevron-down'} size={20} style={{ top: 3 }} />
                    </TouchableOpacity>
                    {
                        isShowSetting && <>
                            <TouchableOpacity onPress={() => navigation.navigate('accountSetting')}
                                style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Cài đặt</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Lối tắt quyền riêng tư</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Thời gian bạn ở trên Facebook</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Ngôn ngữ</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Trình tiết kiệm dữ liệu</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.item, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
                                    <Image style={{ width: 30, height: 30 }}
                                        source={require('../../assets/icons/icon-watch.png')} />
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>Trình tạo mã</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    }
                </View>
                <TouchableOpacity onPress={() => handleExitApp()}
                    style={{
                        paddingHorizontal: 10, flexDirection: 'column',
                        borderColor: '#d8d9de', borderTopWidth: 1, borderBottomWidth: 1, justifyContent: 'center',
                        minHeight: 45
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name='power-settings-new' size={25} />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, top: 3 }}>Thoát</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogout()}
                    style={{
                        paddingHorizontal: 10, flexDirection: 'column',
                        borderColor: '#d8d9de', borderTopWidth: 1, borderBottomWidth: 1, justifyContent: 'center',
                        minHeight: 45
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name='logout' size={25} style={{ left: 1 }} />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, top: 3 }}>Đăng xuất</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white', flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10,
        margin: 2,
        marginBottom: 6,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 10,

        elevation: 2,
    }
})
export default memo(MenuScreen);
