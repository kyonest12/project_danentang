import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    BackHandler,
    TextInput,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@react-native-material/core";
import {
    _getCache,
    _setCache
} from '../../Services/Helper/common';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { COMMON_COLOR } from '../../Services/Helper/constant';
import { resetStatusSetUser, resetUserSlice, setUserName } from '../../Redux/userSlice';
import authService from '../../Services/Api/authService';
import { logout, resetAuthSlice } from '../../Redux/authSlice';
import LoadingApiModal from '../../Components/modal/LoadingApiModal';
import { resetPostSlice } from '../../Redux/postSlice';
import { resetEmojiSlice } from '../../Redux/emojiSlice';
import { resetTabSlice } from '../../Redux/tabSlice';
import { resetUserInfoSlice } from '../../Redux/userInforSlice';
import { resetVideoSlice } from '../../Redux/videoSlice';
function PasswordSetting({ navigation }) {
    const dispatch = useDispatch();
    const { userInfor } = useSelector(state => state.user);
    const { user } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = () => {
        if (!confirmPassword || !newPassword || !currentPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.", [
                { text: "OK", onPress: () => null }
            ]);
            return;
        }
        if (confirmPassword !== newPassword) {
            Alert.alert("Đổi mật khẩu thất bại", "Xác nhận mật khẩu không chính xác.", [
                { text: "OK", onPress: () => null }
            ]);
            return;
        }
        setIsLoading(true);
        authService.changePassword(currentPassword, newPassword).then((result) => {
            setIsLoading(false);
            Alert.alert("Đổi mật khẩu thành công", "Đăng nhập lại để tiếp tục", [
                {
                    text: "OK", onPress: async () => {
                        console.log(user);
                        await authService.removeLoginInfo({phonenumber: user.phoneNumber});
                        dispatch(resetPostSlice());
                        dispatch(resetAuthSlice());
                        dispatch(resetEmojiSlice());
                        dispatch(resetTabSlice());
                        dispatch(resetUserSlice());
                        dispatch(resetUserInfoSlice());
                        dispatch(resetVideoSlice());
                        dispatch(logout());
                    }
                }
            ]);
        }).catch(e => {
            setIsLoading(false);
            console.log(e.response.data);
            let messageError = "";
            if (e.response.data.code == "1004") {
                messageError = "Mật khẩu mới không được giống mật khẩu cũ quá 80%."
                if (e.response.data.details === "password khong dung") messageError = "Mật khẩu không đúng"
            }
            else {
                messageError = "Vui lòng thử lại sau."
            }

            Alert.alert("Đổi mật khẩu thất bại", messageError, [
                { text: "OK", onPress: () => null }
            ]);
        });
    }
    return (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#ccc' }}>
            <View style={{
                marginTop: 10, marginHorizontal: 10,
                backgroundColor: 'white', borderRadius: 5
            }}>
                <View style={{ flexDirection: 'column' }}>
                    <View>
                        <TextInput
                            onChangeText={(e) => setCurrentPassword(e)}
                            style={{ height: 35, width: "100%", margin: 5, padding: 5 }}
                            underlineColorAndroid="transparent"
                            placeholder='Mật khẩu hiện tại'
                            value={currentPassword}
                            secureTextEntry={true}
                        />
                        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                        <TextInput
                            onChangeText={(e) => setNewPassword(e)}
                            style={{ height: 35, width: "100%", margin: 5, padding: 5 }}
                            underlineColorAndroid="transparent"
                            placeholder='Mật khẩu mới'
                            value={newPassword}
                            secureTextEntry={true}
                        />
                        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                        <TextInput
                            onChangeText={(e) => setConfirmPassword(e)}
                            style={{ height: 35, width: "100%", margin: 5, padding: 5 }}
                            underlineColorAndroid="transparent"
                            placeholder='Gõ lại mật khẩu mới'
                            value={confirmPassword}
                            secureTextEntry={true}
                        />
                    </View>

                </View>

            </View>
            <LoadingApiModal modalVisible={isLoading} title={'Đang cập nhật'} />
            <Button title="Lưu thay đổi"
                onPress={() => handleSubmit()}
                uppercase={false}
                color={COMMON_COLOR.BLUE_COLOR}
                style={{ marginTop: 10, marginHorizontal: 10 }}
            />
            <Button title="Hủy"
                onPress={() => navigation.goBack()}
                uppercase={false}
                color={'white'}
                tintColor="#7c7f83"
                style={{ marginTop: 10, marginBottom: 5, borderColor: '#ccc', borderWidth: 0.5, marginHorizontal: 10 }}
            />
            <TouchableOpacity style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ color: '#687699', fontSize: 14 }}>Quên mật khẩu?</Text>
            </TouchableOpacity>
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
export default memo(PasswordSetting);
