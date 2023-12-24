import {
    Text, View, StyleSheet, Image, BackHandler, Alert,
    TouchableOpacity, Dimensions
} from "react-native";
import { Button, TextInput } from "@react-native-material/core";
import { useCallback, useLayoutEffect, useState } from "react";
import { deepCopy, isValidEmail } from "../Services/Helper/common";
import { REST_API_URL } from "../Services/Helper/constant";
import NetInfo from '@react-native-community/netinfo';
import MyDatePicker from "../Components/MyDatePicker";
import { TabView, SceneMap } from 'react-native-tab-view';
import { getAge } from "../Services/Helper/common";
import { useEffect } from "react";
import { useRef } from "react";
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from "react-redux";
import authService from '../Services/Api/authService';
import { login, changeLoginWithCache } from "../Redux/authSlice";
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COMMON_COLOR } from "../Services/Helper/constant";
import userService from "../Services/Api/userService";
export default function SignupScreen({ navigation }) {
    const dispatch = useDispatch();
    // state
    const step = ['Tạo tài khoản', 'Tên', 'Ngày sinh', 'Email',
        'Mật khẩu', 'Điều khoản & quyền riêng tư', 'Xác nhận tài khoản', 'Tạo tài khoản thành công'];
    const [stepIndex, setStepIndex] = useState(0);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [dataBirthDay, setDataBirthDay] = useState(new Date());
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [checkValidate, setCheckValidate] = useState(0);
    const [verifyCode, setVerifyCode] = useState();
    const [verifyCodeServer, setVerifyCodeServer] = useState();
    const { height } = Dimensions.get("window");
    const validate = useRef({
        firstName: {
            exactly: true,
            errorName: '',
        },
        lastName: {
            exactly: true,
            errorName: '',
        },
        email: {
            exactly: true,
            errorName: '',
        },
        password: {
            exactly: true,
            errorName: ''
        },
        birthday: {
            exactly: true,
            errorName: ''
        },
        password: {
            exactly: true,
            errorName: ''
        },
        confirmPassword: {
            exactly: true,
            errorName: ''
        },
        verifyCode: {
            exactly: true,
            errorName: ''
        }
    });
    // function
    const handleSetFirstName = (e) => {
        let dataTmp = deepCopy(validate.current);
        var regFistName = /[0-9]+/g;
        if (e === undefined || e === "") {
            dataTmp['firstName'] = {
                exactly: false,
                errorName: 'Vui lòng nhập'
            }
        } else if (regFistName.test(e)) {
            dataTmp['firstName'] = {
                exactly: false,
                errorName: 'Không thể chứa số'
            }
        }
        else {
            dataTmp['firstName'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setFirstName(e);
        setCheckValidate(checkValidate + 1);
    }
    const handleSetLastName = (e) => {
        let dataTmp = deepCopy(validate.current);
        setLastName(e);
        var regLastName = /[0-9]+/g;
        if (e === undefined || e === "") {
            dataTmp['lastName'] = {
                exactly: false,
                errorName: 'Vui lòng nhập'
            }
        }else if (regLastName.test(e)) {
            dataTmp['lastName'] = {
                exactly: false,
                errorName: 'Không thể chứa số'
            }
        }
        else {
            dataTmp['lastName'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setCheckValidate(checkValidate + 1);
    }
    const handleSetEmail = (e) => {
        let dataTmp = deepCopy(validate.current);
        if (e === "" || !isValidEmail(e)) {
            console.log(e)
            dataTmp['email'] = {
                exactly: false,
                errorName: 'email không hợp lệ'
            }
        }
        else {
            dataTmp['emai'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setEmail(e);
        setCheckValidate(checkValidate + 1);
    }
    const handleSetPassword = (e) => {
        let dataTmp = deepCopy(validate.current);
        setPassword(e);
        if (e == undefined || e.length < 6) {
            dataTmp['password'] = {
                exactly: false,
                errorName: 'Mật khẩu phải lớn hơn 6 ký tự'
            }
        }else if(e.length>10){
            dataTmp['password'] = {
                exactly: false,
                errorName: 'Mật khẩu phải không quá 10 ký tự'
            }
        }
        else {
            dataTmp['password'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setCheckValidate(checkValidate + 1);
    }
    const handleSetConfirmPassword = (e) => {
        let dataTmp = deepCopy(validate.current);
        setConfirmPassword(e);
        if (e !== password) {
            dataTmp['confirmPassword'] = {
                exactly: false,
                errorName: 'Mật khẩu không khớp'
            }
        }
        else {
            dataTmp['confirmPassword'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setCheckValidate(checkValidate + 1);
    }
    const handleSetBirthDay = (date) => {
        let dataTmp = deepCopy(validate.current);
        if (date === undefined || date === "" || getAge(date) <= 4) {
            dataTmp['birthday'] = {
                exactly: false,
                errorName: 'Hình như bạn đã nhập sai thông tin. Hãy đảm bảo sử dụng đúng ngày sinh của mình.'
            }
        }
        else {
            dataTmp['birthday'] = {
                exactly: true,
                errorName: ''
            }
        }
        validate.current = dataTmp;
        setDataBirthDay(date);
        console.log(date)
        setCheckValidate(checkValidate + 1);
    }
    const handleNextStep = async () => {
        if (stepIndex === 0) {
            setStepIndex(1);
            navigation.setOptions({ title: step[1] })
        }
        if (stepIndex === 1) {
            handleSetLastName(lastName);
            if (validate.current.lastName.exactly) handleSetFirstName(firstName);
        }
        if (stepIndex === 2) handleSetBirthDay(dataBirthDay);
        if (stepIndex === 3) {
            handleSetEmail(email);
        }
        if (stepIndex === 4) {
            handleSetPassword(password);
            if (validate.current.password.exactly) handleSetConfirmPassword(confirmPassword);
        }
        if (!validate.current.firstName.exactly || !validate.current.lastName.exactly
            || !validate.current.birthday.exactly || !validate.current.email.exactly
            || !validate.current.password.exactly || !validate.current.confirmPassword.exactly) return;
        // console.log(index);
        setStepIndex(stepIndex + 1);
        navigation.setOptions({ title: step[stepIndex + 1] })
    }
    const handleSetVerifyCode = (e) => {
        if (e !== verifyCodeServer) {
            validate.current.verifyCode.exactly = false;
            validate.current.verifyCode.errorName = 'Mã code không đúng';
        }
        else {
            validate.current.verifyCode.exactly = true;
            validate.current.verifyCode.errorName = '';
        }
        setVerifyCode(e);
        setCheckValidate(validate + 1);
    }
    const handleVerifyCode = () => {

        authService.checkVerifyCode(email, verifyCode).then(() => {
            validate.current.verifyCode.exactly = true;
            validate.current.verifyCode.errorName = '';
            handleNextStep();
        }).catch(e => {
            console.log(e);
            validate.current.verifyCode.exactly = false;
            validate.current.verifyCode.errorName = 'Mã code không đúng';
        });

    }
    const handleSignUp = () => {
        let date = dataBirthDay.getFullYear() + '-' + (dataBirthDay.getMonth() + 1) + '-' + dataBirthDay.getDate();
        authService.signup(email, password, firstName.trim() + ' ' + lastName.trim(), date).then((result) => {
            console.log("result: ", result);
            setVerifyCodeServer(result["data"]["verify_code"]);
            handleNextStep();
        }).catch(e => {
            console.log(e);
        });
    }
    const handleCheckEmail = () => {
        console.log(email)
        authService.checkExistEmail(email).then((result) => {
            console.log(result.code)
            if (result.code != 1000) {
                validate.current.email.exactly = false;
                validate.current.email.errorName = 'Email đã tồn tại';
                setCheckValidate(checkValidate + 1);
            }
            else {
                validate.current.email.exactly = true;
                validate.current.email.errorName = '';
                handleNextStep();
            }
        }).catch((e) => {
            console.log(e);
        })
    }
    const handleBack = stepIndex => {
        if (0 < stepIndex && stepIndex < 7) {
            Alert.alert("Bạn có muốn dừng tạo tài khoản không?", "Nếu dừng bây giờ, bạn sẽ tất toàn bộ tiến trình cho đến nay.", [
                {
                    text: "Tiếp tục tạo tài khoản",
                    onPress: () => null,
                },
                { text: "Dừng tạo tài khoản", onPress: () => navigation.goBack() }
            ]);
        }
        else {
            navigation.goBack();
        }
        return true;
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                stepIndex !== 7 ? <TouchableOpacity
                    style={{ marginRight: 10, marginTop: 5 }}
                    onPress={() => handleBack(stepIndex)}>
                    <AntDesign name="arrowleft" size={25} />
                </TouchableOpacity> : <></>
            )
        });
    }, [navigation, stepIndex]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => handleBack(stepIndex)
        );
        return () => backHandler.remove();
    }, [stepIndex]);
    return <View style={styles.container}>
        {
            stepIndex === 0
                ? <View style={styles.viewIndex}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Tham gia Facebook
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Chúng tôi sẽ giúp bạn tạo tài khoản mới sau vài bước dễ dàng.
                    </Text>
                    <Button title="Tiếp"
                        uppercase={false}
                        color={COMMON_COLOR.BLUE_COLOR}
                        style={{ marginTop: 50, width: '100%' }}
                        onPress={() => handleNextStep()}
                    />
                </View>
                : stepIndex === 1 ?
                    <View style={styles.viewIndex}>
                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                Nhập họ tên của bạn
                            </Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <TextInput value={lastName} label="Họ"
                                        onChangeText={(e) => handleSetLastName(e)}
                                        style={{
                                            padding: 2,
                                            width: '100%', marginTop: 30
                                        }} variant="standard" color={validate.current.lastName.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                    {validate.current && !validate.current.lastName.exactly &&
                                        <Text style={{ color: 'red', marginTop: 10 }}>
                                            {validate.current.lastName.errorName}
                                        </Text>}
                                </View>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <TextInput value={firstName} label="Tên"
                                        onChangeText={(e) => handleSetFirstName(e)}
                                        style={{ width: '100%', padding: 2, marginTop: 30 }} variant="standard"
                                        color={validate.current.firstName.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                    {validate.current && !validate.current.firstName.exactly &&
                                        <Text style={{ color: 'red', marginTop: 10 }}>
                                            {validate.current.firstName.errorName}
                                        </Text>}
                                </View>
                            </View>
                        </View>
                        <Button title="Tiếp"
                            uppercase={false}
                            color={COMMON_COLOR.BLUE_COLOR}
                            style={{ marginTop: 50, width: '100%' }}
                            onPress={() => handleNextStep()}
                        />
                    </View>
                    : stepIndex === 2 ?
                        <View style={styles.viewIndex}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                Ngày sinh của bạn khi nào?
                            </Text>
                            {
                                !validate.current.birthday.exactly &&
                                <Text style={{ color: 'red', textAlign: 'center', marginVertical: 20 }}>
                                    {validate.current.birthday.errorName}
                                </Text>
                            }
                            <View style={{ paddingHorizontal: 30 }}>
                                <MyDatePicker onChange={(data) => handleSetBirthDay(data)} />
                            </View>
                            <Text style={{ textAlign: 'center', marginTop: 20 }}
                            >{`${getAge(dataBirthDay)} tuổi`}</Text>
                            <Button title="Tiếp"
                                uppercase={false}
                                color={COMMON_COLOR.BLUE_COLOR}
                                style={{ marginTop: 50, width: '100%' }}
                                onPress={() => handleNextStep()}
                            />
                        </View>
                        : stepIndex === 3 ?
                            <View style={styles.viewIndex}>
                                <View style={{ flexDirection: 'column', width: '100%' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                        Nhập email 
                                    </Text>
                                    <TextInput value={email} label="Email"
                                        onChangeText={(e) => handleSetEmail(e)}
                                        style={{ width: '100%', marginTop: 30 }} variant="outlined"
                                        color={validate.current.email.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                    {!validate.current.email.exactly &&
                                        <Text style={{ color: 'red', marginTop: 10 }}>
                                            {validate.current.email.errorName}
                                        </Text>}
                                </View>
                                <Button title="Tiếp"
                                    uppercase={false}
                                    color={COMMON_COLOR.BLUE_COLOR}
                                    style={{ marginTop: 50, width: '100%' }}
                                    onPress={() => handleCheckEmail()}
                                />
                            </View>
                            : stepIndex === 4 ?
                                <View style={styles.viewIndex}>
                                    <View style={{ flexDirection: 'column', width: '100%' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                            Nhập mật khẩu
                                        </Text>
                                        <TextInput value={password} label="Mật khẩu" secureTextEntry={true}
                                            onChangeText={(e) => handleSetPassword(e)}
                                            style={{ width: '100%', marginTop: 30 }} variant="outlined"
                                            color={validate.current.password.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                        {!validate.current.password.exactly &&
                                            <Text style={{ color: 'red', marginTop: 10 }}>
                                                {validate.current.password.errorName}
                                            </Text>}
                                        <TextInput value={confirmPassword} label="Xác nhận mật khẩu" secureTextEntry={true}
                                            onChangeText={(e) => handleSetConfirmPassword(e)}
                                            style={{ width: '100%', marginTop: 10 }} variant="outlined"
                                            color={validate.current.confirmPassword.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                        {!validate.current.confirmPassword.exactly &&
                                            <Text style={{ color: 'red', marginTop: 10 }}>
                                                {validate.current.confirmPassword.errorName}
                                            </Text>}
                                    </View>
                                    <Button title="Tiếp"
                                        uppercase={false}
                                        color={COMMON_COLOR.BLUE_COLOR}
                                        style={{ marginTop: 50, width: '100%' }}
                                        onPress={() => handleNextStep()}
                                    />
                                </View>
                                : stepIndex === 5 ?
                                    <View style={{ flex: 1 }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 30 }}>
                                            <Button title="Đăng ký"
                                                uppercase={false}
                                                color={COMMON_COLOR.BLUE_COLOR}
                                                style={{ width: '100%', position: 'absolute', top: height / 2, zIndex: 9999 }}
                                                onPress={() => handleSignUp()}
                                            />
                                        </View>
                                    </View>
                                    : stepIndex === 6 ?
                                        <View style={styles.viewIndex}>
                                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                                    Nhập mã code {verifyCodeServer} để xác nhận tài khoản
                                                </Text>
                                                <TextInput value={verifyCode} label="Mã code"
                                                    onChangeText={(e) => handleSetVerifyCode(e)}
                                                    style={{ width: '100%', marginTop: 30, paddingHorizontal: 50 }} variant="outlined"
                                                    color={validate.current.verifyCode.exactly ? COMMON_COLOR.BLUE_COLOR : 'red'} />
                                                {!validate.current.verifyCode.exactly &&
                                                    <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
                                                        {validate.current.verifyCode.errorName}
                                                    </Text>}
                                            </View>
                                            <Button title="Xác nhận"
                                                uppercase={false}
                                                color={COMMON_COLOR.BLUE_COLOR}
                                                style={{ marginTop: 50, width: '100%' }}
                                                onPress={() => handleVerifyCode()}
                                            />
                                        </View>
                                        : stepIndex === 7 ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Animatable.View animation='zoomIn'>
                                                        <Animatable.View delay={1000} animation='rotate'>
                                                            <Animatable.View
                                                                delay={2000}
                                                                iterationCount={3}
                                                                animation='rubberBand'>
                                                                <View >
                                                                    <Image style={{ width: 250, height: 250 }}
                                                                        source={require('../../assets/images/logo_sign_up.png')}
                                                                    />

                                                                </View>
                                                            </Animatable.View>
                                                        </Animatable.View>
                                                    </Animatable.View>
                                                    <Animatable.View animation='zoomIn'>
                                                        <Text style={{ marginTop: 50, fontWeight: 'bold', color: COMMON_COLOR.BLUE_COLOR }}>ĐĂNG KÝ THÀNH CÔNG</Text>
                                                    </Animatable.View>
                                                </View>

                                                <Button title="Nhấn để tiếp tục"
                                                    uppercase={false}
                                                    color={COMMON_COLOR.BLUE_COLOR}
                                                    style={{ marginTop: 50, width: '70%' }}
                                                    onPress={() => {
                                                        dispatch(login({ email: email, password: password }));
                                                        userService.changeInforAfterSignup(firstName.trim() + ' ' + lastName.trim(), "").then((res) => {
                                                            console.log('res after signup: ', res);
                                                            dispatch(login({ email: email, password: password }));
                                                        }).then((e) => {
                                                            console.log(e.response);
                                                        })
                                                        dispatch(changeLoginWithCache(false))
                                                    }
                                                    }
                                                />
                                            </View>
                                            : <></>

        }

    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewIndex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white'
    },
    logoFacebook: {
        width: 50,
        height: 50
    },
    btnSignup: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginTop: 100
    }
});