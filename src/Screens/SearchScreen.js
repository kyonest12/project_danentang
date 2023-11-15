import React, { useEffect, useState, useRef, memo } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    TouchableWithoutFeedbackComponent,
    ScrollView,
} from 'react-native';
import { Image, FlatList } from 'react-native';
// import { COMMON_COLOR } from "../Services/Helper/constant";
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
import axios from '../setups/custom_axios';
import { MaterialIcons, EvilIcons } from '@expo/vector-icons';
import PostInHome from '../Components/PostInHome';
function SearchScreen({ navigation }) {
    const { user } = useSelector(
        (state) => state.auth
    );
    const inputRef = useRef()
    const [keyword, setKeyword] = useState("");
    const [keywordList, setKeywordList] = useState([]);
    const [isShowPost, setIsShowPost] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postList, setPostList] = useState([]);
    const getCacheSearchList = async () => {
        try {
            let list = JSON.parse(await _getCache("cacheSearchList"));
            if (list === null || list === undefined || list === "") list = [];
            return list;
        }
        catch (e) {
            console.log(e);
        }
    }
    const handleSelectSavedSearch = (keyword) => {
        setKeyword(keyword);
        handleSearch(keyword);
    }
    const handleSearch = (keyword) => {
        // call api search
        setIsLoading(true);
        axios.post(`/search/search?keyword=${keyword}&index=0&count=10`).then((result) => {
            console.log('data', result.data);
            setPostList(result.data);
            setIsLoading(false);
        }).catch(e => {
            console.log(e);
            setIsLoading(false);
        })
        setIsShowPost(true)
        saveCacheSearch(keyword);
    }
    const handleClear = () => {
        inputRef.current.clear()
        setKeyword('');
        setKeywordList('')
        handleChangeText('')
    }
    const handleChangeText = async (e) => {
        let list = JSON.parse(await _getCache("cacheSearchList"));
        if (list === null || list === undefined || list === "") list = [];
        console.log(list);
        let tmp = list.filter(word => word.toUpperCase().includes(e.toUpperCase()));
        setKeywordList(tmp);
        setKeyword(e);
        setIsShowPost(false);
    }
    const saveCacheSearch = async (keyword) => {
        try {
            if (!keyword) return;
            let list = JSON.parse(await _getCache("cacheSearchList"));
            if (list === null || list === undefined || list === "") list = [];
            let index = list.indexOf(keyword);
            if (index === -1) list.unshift(keyword);
            // remove cache
            // await _setCache("ketwordList", "");
            await _setCache("cacheSearchList", JSON.stringify(list));
        }
        catch (e) {
            console.log(e);
        }
    }
    const removeSavedSearch = async (keyword) => {
        try {
            let list = JSON.parse(await _getCache("cacheSearchList"));
            if (list === null || list === undefined || list === "") list = [];
            let index = list.indexOf(keyword);
            if (index > -1) list.splice(index, 1);
            // remove cache
            // await _setCache("ketwordList", "");
            await _setCache("cacheSearchList", JSON.stringify(list));
            handleChangeText('');
        }
        catch (e) {
            console.log(e);
        }
    }
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ width: '100%' }}>
                    <TextInput
                        style={{ width: '60%' }}
                        // style={styles.textSearch}
                        ref={inputRef}
                        placeholder="Tìm kiếm"
                        // value={keyword}
                        onFocus={() => getCacheSearchList()}
                        onChangeText={e => handleChangeText(e)}
                        onSubmitEditing={() => handleSearch(keyword)}
                    >
                    </TextInput>
                </View>
            ),
            headerRight: () => (
                keyword && <TouchableOpacity onPress={() => handleClear()}>
                    <MaterialIcons name="clear" size={25} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: 'white', //Set Header color
            },
        });
    }, [navigation, keyword])
    useEffect(() => {
        handleChangeText('');
    }, [])
    return (
        <View style={{ ...styles.container, backgroundColor: isShowPost ? '#ccc' : 'white' }}>
            {!isShowPost && <View style={{ flexDirection: 'column', marginHorizontal: 10, padding: 10, paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', width: ' 100%', justifyContent: 'space-between', marginBottom: 15 }}>
                    <Text style={{ color: 'black', fontSize: 20, fontWeight: "bold" }}>Tìm kiếm gần đây</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('deleteSearch')}>
                        <Text style={{ color: '#216fdb', fontSize: 17, marginLeft: 30, top: 2 }}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {

                        keywordList?.length > 0
                            ? (keywordList?.map((item, index) => {
                                return (
                                    <View key={index} style={{
                                        width: '100%', paddingVertical: 7,
                                        flexDirection: 'row', justifyContent: 'space-between'
                                    }}>

                                        <TouchableOpacity onPress={() => handleSelectSavedSearch(item)}
                                            style={{ flexDirection: 'row', width: '80%' }}>
                                            <EvilIcons name="clock" color="#c1c2c4" size={25} style={{ top: 1, marginRight: 6 }} />
                                            <Text style={{ fontSize: 17 }}>{item}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => removeSavedSearch(item)}>
                                            <MaterialIcons name="clear" size={25} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                            ) : (<View><Text>Không có kết quả tìm kiếm</Text></View>)
                    }
                </ScrollView>
            </View>
            }
            {
                !isLoading && isShowPost && postList?.length > 0 &&
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={postList}
                    renderItem={(data) => {
                        // console.log(data);
                        return <PostInHome navigation={navigation} key={data.item.id} postData={data.item} userID={user.id} />
                    }}
                    // Performance settings
                    removeClippedSubviews={true} // Unmount components when outside of window 
                    initialNumToRender={1} // Reduce initial render amount
                    maxToRenderPerBatch={1} // Reduce number in each render batch
                    updateCellsBatchingPeriod={100} // Increase time between renders
                    windowSize={7} // Reduce the window size
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={refreshing}
                    //         onRefresh={onRefresh}
                    //         colors={["#0f80f7"]}
                    //     />}
                    onScroll={({ nativeEvent }) => {
                        // handleScroll(nativeEvent);
                        // if (isCloseToBottom(nativeEvent)) {
                        //     pageIndex.current++;
                        //     setPostList(postListTotal.slice(pageIndex.current * 4 + (pageIndex.current + 1) * 4));
                        //     console.log('end');
                        // }
                    }}
                    scrollEventThrottle={400} // kich hoat onScroll trong khung hinh co do dai 400
                />

            }
            {
                !isLoading && isShowPost && postList?.length === 0 &&
                <Text style={{ paddingTop: 10, paddingHorizontal: 20, fontSize: 17 }}>Không có kết quả tìm kiếm</Text>
            }
            {
                isLoading &&
                <Text style={{ paddingTop: 10, paddingHorizontal: 20, fontSize: 17 }}>Đang tìm kiếm ...</Text>
            }
        </View >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        // paddingTop: 10,
        backgroundColor: 'white'
    },
    title: {
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
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
    },
    textSearch: {
        color: "black",
    },
    itemResult: {

    }
});

export default SearchScreen;