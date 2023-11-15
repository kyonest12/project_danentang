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
} from '../../Services/Helper/common';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { COMMON_COLOR } from '../../Services/Helper/constant';
function AccountSetting({ navigation }) {
    const dispatch = useDispatch();
    return (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ margin: 10, marginHorizontal: 20 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>Cài đặt tài khoản</Text>
                    <Text style={{ fontSize: 12, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>Quản lý thông tin về bạn, các khoản thanh toán và danh bạ của bạn cũng như các tài khoản nói chung.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('nameSetting')}
                        style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name='info' size={25} style={{ marginRight: 10 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, fontWeight: '500' }}>Thông tin cá nhân</Text>
                                <Text style={{ fontSize: 12, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>Cập nhật tên, số điện thoại và địa chỉ email của bạn.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('passwordSetting')}
                    style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name='lock' size={25} style={{ marginRight: 10 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, fontWeight: '500' }}>Bảo mật</Text>
                                <Text style={{ fontSize: 12, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>Đổi mật khẩu và thực hiện các hành động khác để tăng cường bảo mật cho tài khoản của bạn.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name='privacy-tip' size={25} style={{ marginRight: 10 }} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, fontWeight: '500' }}>Quyền riêng tư</Text>
                                <Text style={{ fontSize: 12, color: COMMON_COLOR.GRAY_TEXT_COLOR }}>Các quyền riêng tư của bạn.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
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
export default memo(AccountSetting);
