import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button } from "@react-native-material/core";
import { useState, useEffect } from "react";
import { deepCopy, onlyNumber, _getCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { login, changeFirstLogin, removeLoginInfoInRedux, changeLoginWithCache } from "../Redux/authSlice";
import NetInfo from '@react-native-community/netinfo';
import { useRef } from "react";
import { Ionicons, Entypo, MaterialIcons, EvilIcons, AntDesign } from '@expo/vector-icons';
import authService from "../Services/Api/authService";
import RemoveLoginInfoModal from "../Components/modal/RemoveLoginInfoModal";
import { COMMON_COLOR } from "../Services/Helper/constant";
export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const { loginPhonenumber, loginPassword, loginType } = useSelector(
        (state) => state.auth
    );
    const [checkValidate, setCheckValidate] = useState(0);
    const validate = useRef({
        phonenumber: {
            exactly: true,
            errorName: '',
        },
        password: {
            exactly: true,
            errorName: ''
        },
        verifyCode: {
            exactly: true,
            errorName: ''
        }
    })
    // state
    const [loginWithCache, setLoginWithCache] = useState(true);
    const [showRemoveLoginModal, setShowRemoveLoginModal] = useState(false);
    const [loginInfo, setLoginInfo] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [password, setPassword] = useState();
    const [verifyCode, setVerifyCode] = useState();
    const [verifyCodeServer, setVerifyCodeServer] = useState();
    const [awaitCode, setAwaitCode] = useState();
    const loginInfoSelected = useRef();
    // function
    const handleSetPhonenumber = (e) => {
        if (e === undefined || !onlyNumber(e)) {
            validate.current.phonenumber.exactly = false;
            validate.current.phonenumber.errorName = 'Số điện thoại không hợp lệ'
        }
        else {
            validate.current.phonenumber.exactly = true;
            validate.current.phonenumber.errorName = ''
        }
        setPhonenumber(e);
        setCheckValidate(checkValidate + 1);
    }
    const handleSetPassword = (e) => {
        if (e === undefined || e.length < 6) {
            validate.current.password.exactly = false;
            validate.current.password.errorName = 'Mật khẩu phải lớn hơn 6 ký tự'
        }
        else {
            validate.current.password.exactly = true;
            validate.current.password.errorName = ''
        }
        setPassword(e);
        setCheckValidate(checkValidate + 1);
    }
    const handleSetVerifyCode = (e) => {
        if (e !== verifyCodeServer) {
            validate.current.verifyCode.exactly = false;
            validate.current.verifyCode.errorName = 'Mã code không đúng'
        }
        else {
            validate.current.verifyCode.exactly = true;
            validate.current.verifyCode.errorName = ''
        }
        setVerifyCode(e);
        setCheckValidate(checkValidate + 1);
    }
    const handleVerifyCode = () => {
        authService.checkVerifyCode(loginPhonenumber, verifyCode).then(() => {
            validate.current.verifyCode.exactly = true;
            validate.current.verifyCode.errorName = '';
            dispatch(login({ phonenumber: loginPhonenumber, password: loginPassword }));
        }).catch(e => {
            console.log(e);
            validate.current.verifyCode.exactly = false;
            validate.current.verifyCode.errorName = 'Mã code không đúng';
        });
    }

    const handleLogin = () => {
        handleSetPhonenumber(phonenumber);
        if (validate.current.phonenumber.exactly) handleSetPassword(password);
        if (!validate.current.phonenumber.exactly && !validate.current.password.exactly) return;
        dispatch(login({ phonenumber: phonenumber, password: password }));
        dispatch(changeLoginWithCache(false));
    }
    const handleGetVerifyCode = () => {
        authService.getVerifyCode(loginPhonenumber).then((result) => {
            setVerifyCodeServer(result?.data?.verifyCode);
        }).catch((e) => {
            console.log('await code', +e.response.data.details);
            setVerifyCodeServer(undefined);
            if (+e.response.data.code === 1010) {
                setAwaitCode(Math.round(+e.response.data.details));
            }
        })
    }
    const handleGetListLoginInfo = async () => {
        let listLoginInfo = await authService.getListLoginInfo();
        if (listLoginInfo.length === 0) {
            setLoginWithCache(false);
        }
        else {
            setLoginInfo(listLoginInfo);
        }
    }
    const handleLoginWithCache = (data) => {
        dispatch(login(data));
        dispatch(removeLoginInfoInRedux());
        dispatch(changeLoginWithCache(true));
    }
    const handleInfoLoginCache = (data) => {
        setShowRemoveLoginModal(true);
        loginInfoSelected.current = data;
    }
    const handleRemoveLoginInfo = async () => {
        await authService.removeLoginInfo(loginInfoSelected.current);
        handleGetListLoginInfo();
    }
    useEffect(() => {
        if (loginType === 1) {
            navigation.navigate('saveLoginInfo');
        }
        if (loginType === 2) {
            handleGetVerifyCode();
            navigation.setOptions({ title: 'Xác nhận tài khoản', headerShown: true });
        }
    }, [loginType]);

    useEffect(() => {
        handleGetListLoginInfo();
    }, []);
    if (loginWithCache && loginType !== 0) {
        if  (loginType !== 2) {return <View style={styles.container}>
            {showRemoveLoginModal && 
            <RemoveLoginInfoModal user={loginInfoSelected.current}
            onClose={() => setShowRemoveLoginModal(false)}
            onRemoveLoginInfo={() => handleRemoveLoginInfo()}
            />}
            <Image
                style={styles.logoFacebook}
                source={require('../../assets/images/logo_facebook.png')}
            />
            <View style={{ marginTop: 30 }}>
                {loginInfo?.map((item, index) => {
                    return <View key={index} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 5 }}>
                        <TouchableOpacity onPress={() => handleLoginWithCache(item)}
                         style={{ flex: 1, flexDirection: 'row' }}>
                            <Image
                                style={{
                                    width: 60, height: 60, borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: "#ccc"
                                }}
                                source={
                                    item.avatar === null ? require('../../assets/images/default_avatar.jpg'): { uri: item.avatar }
                                }
                            />
                            <Text style={{ marginTop: 20, marginLeft: 10, fontWeight: 'bold' }}>{item.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>handleInfoLoginCache(item)}>
                            <Entypo style={{ marginTop: 20 }} 
                            name="dots-three-vertical" size={18} color="#626262" />
                        </TouchableOpacity>
                    </View>
                })}
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setLoginWithCache(false)}>
                    <Ionicons name="add" size={25} color={COMMON_COLOR.BLUE_COLOR}
                        style={{ backgroundColor: '#e7f3fe', borderRadius: 5, padding: 2 }} />
                    <Text style={{ color: COMMON_COLOR.BLUE_COLOR, fontWeight: 'bold', marginLeft: 10, marginTop: 5 }}>Đăng nhập bằng tài khoản khác</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10 }}>
                    <AntDesign name="search1" size={20} color={COMMON_COLOR.BLUE_COLOR}
                        style={{ backgroundColor: '#e7f3fe', borderRadius: 5, padding: 5}} />
                    <Text style={{ color: COMMON_COLOR.BLUE_COLOR, fontWeight: 'bold', marginLeft: 10, marginTop: 5 }}>Tìm kiếm tài khoản</Text>
                </TouchableOpacity>
            </View>
            <View style={{position: 'absolute', bottom: 30}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signup')}
                    style={{
                        height: 40,
                        // 
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 50,
                        backgroundColor: '#e7f3fe',
                    }}>
                    <Text uppercase={false}
                        style={{ color: COMMON_COLOR.BLUE_COLOR, fontWeight: 'bold' }}>TẠO TÀI KHOẢN FACEBOOK MỚI</Text>
                </TouchableOpacity>
            </View>
        </View>
        }
        else return <View style={styles.container}>
        <View style={styles.viewIndex}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
                    {(verifyCodeServer !== undefined) ? `Nhập mã code ${verifyCodeServer} để xác nhận tài khoản`
                        : awaitCode !== undefined && `Vui lòng đợi trong ${awaitCode} giây để lấy lại mã xác nhận`}
                </Text>
                {verifyCodeServer !== undefined ?
                    <>
                        <TextInput value={verifyCode} label="Mã code"
                            onChangeText={(e) => handleSetVerifyCode(e)}
                            style={{ width: '100%', marginTop: 30, paddingHorizontal: 10 }} variant="outlined" 
                            color={validate.current.phonenumber.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                        {!validate.current.verifyCode.exactly &&
                            <Text style={{ color: 'red', marginHorizontal: 10, textAlign: 'center' }}>
                                {validate.current.verifyCode.errorName}
                            </Text>}
                        <Button title="Xác nhận"
                            uppercase={false}
                            color={COMMON_COLOR.BLUE_COLOR}
                            style={{ marginTop: 30 }}
                            onPress={() => handleVerifyCode()}
                        />
                    </>
                    : <Button title="Lấy lại mã xác nhận"
                        uppercase={false}
                        color={COMMON_COLOR.BLUE_COLOR}
                        style={{ marginTop: 30 }}
                        onPress={() => handleGetVerifyCode()}
                    />
                }

            </View>

        </View>
    </View>
    }
    else {
        if (loginType === 0 || loginType === null)
            return <View style={styles.container}>
                <Image
                    style={styles.logoFacebook}
                    source={require('../../assets/images/logo_facebook.png')}
                />
                <TextInput value={phonenumber} label="Số điện thoại"
                    onChangeText={(e) => handleSetPhonenumber(e)}
                    style={{ width: '100%', padding: 2, marginTop: 30 }} variant="standard" 
                    color={validate.current.phonenumber.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                {
                    !validate.current.phonenumber.exactly
                        ?
                        <Text style={{ color: 'red', width: '100%', fontSize: 12 }}>{validate.current.phonenumber.errorName}</Text>
                        : <></>
                }
                <TextInput value={password} label="Mật khẩu" secureTextEntry={true}
                    onChangeText={(e) => handleSetPassword(e)}
                    style={{ width: '100%', padding: 2, marginTop: 10 }} variant="standard" 
                    color={validate.current.password.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                {
                    !validate.current.password.exactly
                        ?
                        <Text style={{ color: 'red', width: '100%', fontSize: 12 }}>{validate.current.password.errorName}</Text>
                        : <></>
                }
                {
                    loginType === 0 ?
                        <Text style={{ color: 'red', width: '100%', fontSize: 12, marginTop: 5, marginBottom: 5 }}>Thông tin đăng nhập không đúng</Text> :
                        <></>
                }
                <TouchableOpacity
                    onPress={() => handleLogin()}
                    style={styles.btnLogin}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', marginTop: 10, color: COMMON_COLOR.BLUE_COLOR }}>
                    Quên mật khẩu?
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#8c8d90' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', color: '#8c8d90' }}>HOẶC</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#8c8d90' }} />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signup')}
                    style={styles.btnSignup}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Tạo tài khoản Facebook mới</Text>
                </TouchableOpacity>
            </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white'
    },
    viewIndex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        width: '100%'
    },
    logoFacebook: {
        width: 50,
        height: 50
    },
    btnLogin: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: COMMON_COLOR.BLUE_COLOR,
        marginTop: 10
    },
    btnSignup: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginTop: 50,
        backgroundColor: '#31a24c',
    }
});