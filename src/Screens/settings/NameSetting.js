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
import { resetStatusSetUser, setUserName } from '../../Redux/userSlice';
import LoadingApiModal from '../../Components/modal/LoadingApiModal';
function NameSetting({ navigation }) {
    const dispatch = useDispatch();
    const { userInfor, isLoading, isErrorUpdateUserName } = useSelector(state => state.user);
    console.log(userInfor);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const handleSubmit = () => {
        dispatch(setUserName({userName: firstName.trim() + " " + lastName.trim()}))
    }
    useEffect(() => {
        if (userInfor){
            let indexSpace = userInfor.username.lastIndexOf(" ");
            setLastName(userInfor.username.substring(indexSpace + 1, userInfor.username.length));
            setFirstName(userInfor.username.substring(0, indexSpace));
        }    
    }, [userInfor]);
    useEffect(() => {
        if (isErrorUpdateUserName === true){
            Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại sau.", [
                { text: "OK", onPress: () => dispatch(resetStatusSetUser()) }
            ]);
        }
        if (!isLoading && isErrorUpdateUserName === false){
            Alert.alert("Cập nhật thành công", "", [
                { text: "OK", onPress: () => dispatch(resetStatusSetUser()) }
            ]);
        }
    }, [isErrorUpdateUserName])
    return (
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: '#ccc' }}>
            <View style={{
                marginTop: 15, marginHorizontal: 10,
                backgroundColor: 'white', borderRadius: 5
            }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', margin: 5 }}>Các tên khác</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                    <TouchableOpacity>
                        <Text style={{ fontSize: 14, margin: 5, color: '#687699' }}>Thêm biệt danh, tên khai sinh...</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                marginTop: 10, marginHorizontal: 10,
                backgroundColor: 'white', borderRadius: 5
            }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', margin: 5 }}>Tên</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                    <View style={{ margin: 5 }}>
                        <Text>Họ</Text>
                        <TextInput
                            onChangeText={(e) => setLastName(e)}
                            style={{ height: 35, width: "70%", borderColor: 'gray', borderWidth: 1, marginBottom: 5, padding: 5 }}
                            value={lastName}
                            underlineColorAndroid="transparent"
                        />
                        <Text>Tên đệm</Text>
                        <TextInput
                            style={{ height: 35, width: "70%", borderColor: 'gray', borderWidth: 1, marginBottom: 5, padding: 5 }}
                            underlineColorAndroid="transparent"
                        />
                        <Text>Tên</Text>
                        <TextInput
                            onChangeText={(e) => setFirstName(e)}
                            style={{ height: 35, width: "70%", borderColor: 'gray', borderWidth: 1, marginBottom: 5, padding: 5 }}
                            value={firstName}
                            underlineColorAndroid="transparent"
                        />
                        <LoadingApiModal modalVisible={isLoading} title={'Đang cập nhật'}/>
                        <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f5f6f8', borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }}>
                            <Text>
                                <Text style={{ fontWeight: '600' }}>Xin lưu ý rằng: </Text>
                                <Text>
                                    Nếu đổi lại tên trên Facebook, bạn không thể đổi lại tên không 60 ngày.
                                    Đừng thêm bất cứ cách viết hoa khác thường, dấu câu, ký tự hoặc các từ ngẫu nhiên.
                                </Text>
                                <Text style={{ color: '#687699' }}>Tìm hiểu thêm.</Text>

                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text>Tên theo ngôn ngữ</Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#687699' }}>Thêm hoặc thay đổi tên theo ngôn ngữ</Text>
                            </TouchableOpacity>
                        </View>
                        <Button title="Lưu thay đổi"
                            onPress={() => handleSubmit()}
                            uppercase={false}
                            color={COMMON_COLOR.BLUE_COLOR}
                            style={{ width: '100%', marginTop: 10 }}
                        />
                        <Button title="Hủy"
                            onPress={() => navigation.goBack()}
                            uppercase={false}
                            color={'white'}
                            tintColor="#7c7f83"
                            style={{ width: '100%', marginTop: 10, marginBottom: 5, borderColor: '#ccc', borderWidth: 0.5 }}
                        />
                    </View>
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
export default memo(NameSetting);
