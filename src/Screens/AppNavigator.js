import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DashBoardScreen from './DashBoardScreen';
import AboutScreen from './VideoScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import DeleteSearchScreen from './DeleteSearchScreen'
import SystemModal from '../Components/modal/SystemModal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { COMMON_MESSAGE } from '../Services/Helper/constant';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../Redux/authSlice";
import LoadingScreen from './LoadingScreen';
import MessageScreen from './MessageScreen';
import SearchScreen from './SearchScreen';
import SearchUser from './SearchUser';
import CreatePostScreen from './CreatePostScreen';
import authService from '../Services/Api/authService';
import SaveLoginInfoScreen from './SaveLoginInfo';
import ImageLibrary from './ImageLibrary';
import EmojiList from './EmojiList';
import EditProfileScreen from './EditProfile';
import SettingScreen from './SettingScreen';
import EditDescription from './EditDescription';
import AvatarPicker from './AvatarPicker';
import CoverImagePicker from './CoverImagePicker';
import EditPublicInfor from './EditPublicInfor';
import EditCity from './EditCity';
import AllFriendScreen from './AllFriendScreen';
import SuggestFriendScreen from './SuggestFriendScreen';
import AnotherVideoScreen from './AnotherVideoScreen';
import Messager from './messenger/screen';
import ChatScreen from './messenger/ChatScreen';
import ProfileScreen from './ProfileScreen';
import { CHAT_SERVER_URL } from '../Services/Helper/constant';
import { io } from 'socket.io-client';
import { onChangeSocket } from '../Redux/authSlice';
import AccountSetting from './settings/AccountSetting';
import NameSetting from './settings/NameSetting';
import PasswordSetting from './settings/PasswordSetting';
import EditAddress from './EditAddress';
import EditCountry from './EditCountry';
import ListBlock from './ListBlockScreen';
const socket = io(`${CHAT_SERVER_URL}`);
export default function AppNavigator() {
    const netInfo = useNetInfo();
    const dispatch = useDispatch();
    const [token, setToken] = useState();
    const { isLoading, isAuthenticated } = useSelector(
        (state) => state.auth
    );
    const getCacheToken = async () => {
        const token = await authService.getToken();
        setToken(token);
    }
    useEffect(() => {
        if (netInfo.isConnected) dispatch(verifyToken());
        getCacheToken();
    }, [netInfo.isConnected]);
    console.log('isLoading', isLoading, 'isAuthen', isAuthenticated);
    console.log('network connected is', netInfo.isConnected);
    if (netInfo.isConnected && isLoading) return <>
        <LoadingScreen />
        {/* {netInfo.isConnected && <SystemModal icon={'wifi'} body={COMMON_MESSAGE.INTERNET_CONNECTION_SUCCESS} />}
        {!netInfo.isConnected && <SystemModal icon={'wifi-off'} body={COMMON_MESSAGE.INTERNET_CONNECTION_FAILED} />} */}
    </>
    if ((token !== undefined && token !== null && token !== "" && !netInfo.isConnected) || isAuthenticated) return <>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="saveLoginInfo" component={SaveLoginInfoScreen} options={{ title: 'Lưu thông tin đăng nhập' }} />
                <Stack.Screen name="dashboard"  options={{ headerShown: false }}>
                    {(props) => <DashBoardScreen {...props} socket={socket} />}
                </Stack.Screen>
                <Stack.Screen name="message" options={{ title: 'Tin nhắn' }} >
                    {(props) => <Messager {...props} socket={socket} />}
                </Stack.Screen>
                <Stack.Screen name="createPost" component={CreatePostScreen} options={{ title: 'Tạo bài viết' }} />
                <Stack.Screen name="image" component={ImageLibrary} options={{ title: 'Thư viện' }} />
                <Stack.Screen name="emoji" component={EmojiList} options={{ title: 'Cảm xúc' }} />
                <Stack.Screen name="editProfile" component={EditProfileScreen} options={{ title: 'Chỉnh sửa trang cá nhân' }} />
                <Stack.Screen name="setting" component={SettingScreen} options={{ title: 'Cài đặt trang cá nhân' }} />
                <Stack.Screen name="editDescription" component={EditDescription} options={{ title: 'Chỉnh sửa tiểu sử' }} />
                <Stack.Screen name="pickAvatar" component={AvatarPicker} options={{ title: 'Thay đổi ảnh đại diện' }} />
                <Stack.Screen name="pickCover" component={CoverImagePicker} options={{ title: 'Thay đổi ảnh bìa' }} />
                <Stack.Screen name="editPublicInfo" component={EditPublicInfor} options={{ title: 'Thay đổi chi tiết' }} />
                <Stack.Screen name="editCity" component={EditCity} options={{ title: 'Thay đổi chi tiết tỉnh/thành phố' }} />
                <Stack.Screen name="editAddress" component={EditAddress} options={{ title: 'Thay đổi chi tiết địa chỉ' }} />
                <Stack.Screen name="editCountry" component={EditCountry} options={{ title: 'Thay đổi chi tiết đất nước' }} />
                <Stack.Screen name="allfriend" component={AllFriendScreen} />
                <Stack.Screen name="listblock" component={ListBlock} options={{title: 'Danh sách đã chặn'}} />
                <Stack.Screen name="anothervideo" component={AnotherVideoScreen} options={{ headerShown: false }} />
                <Stack.Screen name="suggestfriend" component={SuggestFriendScreen} options={{ title: 'Gợi ý' }} />
                <Stack.Screen name="search" component={SearchScreen} options={{ title: 'Tìm kiếm' }} />
                <Stack.Screen name="searchUser" component={SearchUser} options={{ title: 'Tìm kiếm người dùng' }} />
                <Stack.Screen name="accountSetting" component={AccountSetting} options={{ title: 'Cài đặt' }} />
                <Stack.Screen name="nameSetting" component={NameSetting} options={{ title: 'Tên' }} />
                <Stack.Screen name="passwordSetting" component={PasswordSetting} options={{ title: 'Đổi mật khẩu' }} />
                <Stack.Screen name="profile" component={ProfileScreen} options={{ title: 'Trang cá nhân' }}/>
                {/* //chat */}
                <Stack.Screen name="chatscreen">
                    {(props) => <ChatScreen {...props} socket={socket} />}
                </Stack.Screen>
                <Stack.Screen name="deleteSearch" component={DeleteSearchScreen} options={{title: 'Nhật ký hoạt động'}} />
            </Stack.Navigator>
        </NavigationContainer>
        {netInfo.isConnected && <SystemModal icon={'wifi'} body={COMMON_MESSAGE.INTERNET_CONNECTION_SUCCESS} />}
        {!netInfo.isConnected && <SystemModal icon={'wifi-off'} body={COMMON_MESSAGE.INTERNET_CONNECTION_FAILED} />}
    </>
    return <>
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="signup" component={SignupScreen} options={{ title: 'Tạo tài khoản' }} />
            </Stack.Navigator>
        </NavigationContainer>
        {/* {netInfo.isConnected && <SystemModal icon={'wifi'} body={COMMON_MESSAGE.INTERNET_CONNECTION_SUCCESS} />}
        {!netInfo.isConnected && <SystemModal icon={'wifi-off'} body={COMMON_MESSAGE.INTERNET_CONNECTION_FAILED} />} */}
    </>
}