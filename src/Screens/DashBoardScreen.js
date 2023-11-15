import { Text, View, Button, StyleSheet, ScrollView, TextInput, Easing, BackHandler, useWindowDimensions } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { deepCopy, onlyNumber, _getCache, _setCache } from "../Services/Helper/common";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice";
import { Feather, Fontisto, Entypo, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';
import { TabBar } from 'react-native-tab-view';
import HomeScreen from "./HomeScreen";
import VideoScreen from "./VideoScreen";
import NotificationScreen from "./NotificationScreen";
import MenuScreen from "./MenuScreen";
import FriendScreen from "./FriendScreen";
import ProfileScreen from "./ProfileScreen";
import * as Animatable from 'react-native-animatable';
import { resetEmojiSlice } from "../Redux/emojiSlice";
import { onChangeCurrentTabIndex } from "../Redux/tabSlice";
//import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Animated } from "react-native";
export default function DashBoardScreen({ navigation, socket }) {
    const dispatch = useDispatch();
    const { user } = useSelector(
        (state) => state.auth
    );
    const [totalNewMessage, setTotalNewMessage] = useState(0);
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [isShowTopBar, setIsShowTopBar] = useState(true);
    const [routes] = useState([
        { key: 'first', title: 'home', index: 0 },
        { key: 'second', title: 'watch', index: 1 },
        { key: 'three', title: 'marketplace', index: 2 },
        { key: 'four', title: 'love', index: 3 },
        { key: 'five', title: 'notification', index: 4 },
        { key: 'six', title: 'me', index: 5 }
    ]);
    const FirstRoute = useCallback(() => (
        <HomeScreen 
            // onSwipeDown={() => setIsShowTopBar(true)}
            // onSwipeUp={() => setIsShowTopBar(false)}
            navigation={navigation} />
    ), []);
    const SecondRoute = useCallback(() => (
        <FriendScreen navigation={navigation} />
    ), []);
    const ThreeRoute = useCallback(() => (
        <VideoScreen navigation={navigation} />
    ), []);
    const FourRoute = useCallback(() => (
        <ProfileScreen navigation={navigation} />
        //userId= {'639315083fa4155480da25f0'}
        //63949ce3c9255942b0c05d76
        //token ={token}
    ), []);
    const FiveRoute = useCallback(() => (
        <NotificationScreen />
    ), []);
    const SixRoute = useCallback(() => (
        <MenuScreen navigation={navigation} />
    ), []);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        three: ThreeRoute,
        four: FourRoute,
        five: FiveRoute,
        six: SixRoute
    });
    const handleSwitchTab = (currentIndex) => {
        if (currentIndex !== 0) {
            setIsShowTopBar(false)
        }
        else setIsShowTopBar(true)
        setIndex(currentIndex)
        dispatch(onChangeCurrentTabIndex(currentIndex));
    }
    const goToCreatePost = () => {
        dispatch(resetEmojiSlice());
        navigation.navigate('createPost');
    }
    let xValue = new Animated.Value(isShowTopBar ? -10 : 30);
    useEffect(() => {
        if (isShowTopBar) xValue.setValue(30);
        else xValue.setValue(-10)
        // if (isShowTopBar) {
        //     Animated.timing(xValue, {
        //         toValue: 30,
        //         duration: 100,
        //         easing: Easing.linear,
        //         useNativeDriver: false
        //     }).start();
        // }
        // else {
        //     Animated.timing(xValue, {
        //         toValue: -10,
        //         duration: 100,
        //         easing: Easing.linear,
        //         useNativeDriver: false
        //     }).start();
        // }
    }, [isShowTopBar])
    useEffect(() => {
        socket?.emit('client_get_list_conversation', {
            token: user.token,
            thisUserId: user.id
        })
        socket?.on('server_send_list_conversation', (data) => {
            // console.log('server_send_list_conversation', JSON.stringify(data.totalNewMessage));
            setTotalNewMessage(data.totalNewMessage);
        })
    }, [socket])
    return <>
        <View style={{ position: 'absolute', height: 30, width: '100%', backgroundColor: 'white', zIndex: 10000 }}></View>
        <Animated.View style={{ marginTop: isShowTopBar ? 30 : -10, flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ ...styles.header }}>
                    <Text style={styles.textLogoFacebook}>facebook</Text>
                    <View style={styles.viewBtnRight}>
                        <View style={styles.btnRight}>
                            <Fontisto onPress={() => goToCreatePost()}
                                style={{ left: 1, top: 0.5 }} name="plus-a" size={20} color="black" />
                        </View>
                        <View style={styles.btnRight}>
                            <FontAwesome onPress={() => navigation.navigate('search')}
                                style={{ left: 1 }} name="search" size={22} color="black" />
                        </View>
                        <View style={styles.btnRight}>
                            <Fontisto onPress={() => navigation.navigate('message')}
                                name="messenger" size={22} color="black" />
                            {
                                totalNewMessage > 0 && <View style={{
                                    position: 'absolute', backgroundColor: 'red', padding: 0.5,
                                    minWidth: 15, maxWidth: 20, justifyContent: 'center', alignItems: 'center', right: 0, borderRadius: 15
                                }}>
                                    <Text style={{ fontSize: 10, color: 'white', fontWeight: '700' }}>{

                                        totalNewMessage < 100 ? totalNewMessage : "99+"
                                    }</Text>
                                </View>
                            }
                        </View>
                        {/* </View> */}
                    </View>
                </View>
            </View>
            <TabView
                springConfig
                lazy={true}
                // style={{ marginTop: 20 + topNavBar }}
                renderTabBar={props => <TabBar {...props}
                    indicatorStyle={{ backgroundColor: '#1d6ed9', height: 2 }}
                    style={{ backgroundColor: 'white', minHeight: 30, padding: 0 }} // here
                    renderLabel={({ route, focused, color }) => {
                        return <View style={{ color: 'black' }}>
                            {
                                route.key == 'first' ? <Ionicons color={index === 0 ? '#1d6ed9' : 'black'} name={index === 0 ? 'home' : 'home-outline'} size={25} />
                                    : route.key == 'second' ? <MaterialCommunityIcons color={index === 1 ? '#1d6ed9' : 'black'} style={styles.menuItem} name={index === 1 ? 'account-group' : 'account-group-outline'} size={28} />
                                        : route.key == 'three' ? <Ionicons color={index === 2 ? '#1d6ed9' : 'black'} style={styles.menuItem} name={index === 2 ? 'tv' : 'tv-outline'} size={25} />
                                            : route.key == 'four' ? <Ionicons color={index === 3 ? '#1d6ed9' : 'black'} style={styles.menuItem} name={index === 3 ? 'person' : 'person-outline'} size={25} />
                                                : route.key == 'five' ? <FontAwesome color={index === 4 ? '#1d6ed9' : 'black'} style={styles.menuItem} name={index === 4 ? 'bell' : 'bell-o'} size={22} />
                                                    : <Ionicons color={index === 5 ? '#1d6ed9' : 'black'} style={styles.menuItem} name={index === 5 ? 'menu-outline' : 'menu-outline'} size={28} />
                            }
                        </View>

                    }} />}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={i => handleSwitchTab(i)}
                initialLayout={{ width: layout.width }}
            />
        </Animated.View>
    </>
}
const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    viewBtnRight: {
        flexDirection: "row",
        marginTop: 5
    },
    btnRight: {
        backgroundColor: '#f1f2f4',
        padding: 5,
        borderRadius: 20,
        marginLeft: 10,
        width: 32,
        height: 32
    },
    textLogoFacebook: {
        fontSize: 27,
        color: '#1c7bfc',
        fontWeight: 'bold'
    },
    menuItem: {
        // color: '#636363'
    }
});