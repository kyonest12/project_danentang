import { View, Button, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import axios from '../setups/custom_axios';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-screens';
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
function DeleteSearchScreen({ navigation }) {
    const [result, setResult] = useState([])
    const [clear, setClear] = useState(false)
    const removeSavedSearch = async (keyword) => {
        try {
            let list = JSON.parse(await _getCache("cacheSearchList"));
            if (list === null || list === undefined || list === "") list = [];
            let index = list.indexOf(keyword);
            if (index > -1) list.splice(index, 1);
            await _setCache("cacheSearchList", JSON.stringify(list));
            getCacheSearchList()
        }
        catch (e) {
            console.log(e);
        }
    }


    const getCacheSearchList = async () => {
        try {
            let list = JSON.parse(await _getCache("cacheSearchList"));
            if (list === null || list === undefined || list === "") list = [];
            console.log("cacheSearchList", list)
            setResult(list)
            return list;
        }
        catch (e) {
            console.log(e);
        }
    }
    const handleDeleteAllCacheSearch = async () => {
        try {
            let list = []
            await _setCache("cacheSearchList", JSON.stringify(list));
            getCacheSearchList()
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        getCacheSearchList()
    }, [])
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => handleDeleteAllCacheSearch()}>
                <Text style={{ fontSize:20, textAlign: 'center',color: '#216fdb',  marginLeft: 30, top: 2 }}>Xóa tất cả lịch sử</Text>
            </TouchableOpacity>
            {(result.length != 0 && result.length != undefined) ?
                (
                    result.map((item, index) => {
                        console.log("res", index, item)
                        return (
                            <View key={index} style={{ width: '100%', justifyContent: 'space-between', paddingVertical: 5, flexDirection: 'row' }}>

                                <View style={{marginLeft: 10, flexDirection: 'row' }}>
                                    <Image source={
                                        require('../../assets/images/search_icon.png')
                                    } style={{ width: 80, height: 80, marginRight: 20, borderRadius: 40, borderColor: "#dbdbdd", borderWidth: 5 }} />

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'column' }}>
                                            <Text style={{ fontSize: 17, fontWeight: '600' }}>Bạn đã tìm kiếm trên Facebook </Text>
                                            <Text style={{ color: "#76787c", fontSize: 17, fontWeight: '600' }}>"{item}"</Text>
                                            <Text style={{ color: "#76787c", fontSize: 17, fontWeight: '600' }}>
                                                Chỉ mình tôi - Đã ẩn khỏi dòng thời gian
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => removeSavedSearch(item)}>
                                    <MaterialIcons name="clear" size={25} />
                                </TouchableOpacity>
                            </View>
                        )
                    })
                ) : (<View>
                    <Text style={{fontSize: 20}}>Không có kết quả tìm kiếm</Text>
                </View>

                )}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 10,
        backgroundColor: 'dark'
    }
})

export default DeleteSearchScreen