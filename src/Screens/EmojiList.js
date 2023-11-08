import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList, SafeAreaView, TextInput, Dimensions, TouchableOpacity, } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import data from "./img/emoji";
import { useSelector, useDispatch } from "react-redux";
import { showEmoji, hideEmoji } from "../Redux/emojiSlice";

export default function EmojiList({ navigation }) {
    const [filterData, setfilterData] = useState([]);
    const [masterData, setmasterData] = useState([]);
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(true);
    const checkEmoji = useSelector((state)=> state.emoji.checkEmoji);
    const textEmoji = useSelector((state) => state.emoji.textEmoji);
    const iconEmoji = useSelector((state) => state.emoji.iconEmoji);
    const dispatch = useDispatch();
    useEffect(() => {
        setfilterData(data);
        setmasterData(data);
    }, []);
    const searchFilter = (text) => {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setfilterData(newData);
            setSearch(text);
        } else {
            setfilterData(masterData);
            setSearch(text);
        }
    }
    return (
        <View style={{ flex: 1, paddingTop: 10, backgroundColor: 'white' }}>
            {(show && checkEmoji) ? (
                <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: iconEmoji }} style={styles.img} />
                    <Text style={{ marginLeft: 10 }}>{textEmoji}</Text>
                </View>
                <TouchableOpacity style={{marginRight: 5}}
                onPress={()=> { setShow(!show);
                    dispatch(hideEmoji());
                }}>
                    <Icon name="close" size={24} color='gray'></Icon>
                </TouchableOpacity>
            </View>
                )
                : (
                    <View style={{ flexDirection: 'row' }}>
                    <Icon name="search" size={24} color='gray'></Icon>
                    <TextInput value={search}
                        onChangeText={(text) => searchFilter(text)}
                        placeholderTextColor={'gray'} placeholder={"Tìm kiếm"} style={styles.textinput}></TextInput>
                </View>
                )}
            <FlatList
                data={filterData}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.item} onPress={() => {
                            dispatch(showEmoji({text: item.name, icon: item.img}));
                            navigation.navigate('createPost')}}>
                            <View style={styles.item}>
                                <Image source={{ uri: item.img }} style={styles.img} />
                                <Text style={{ marginLeft: 10 }}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    img: {
        marginLeft: 5,
        width: 30,
        height: 30,
        borderRadius: 50,
        marginBottom: 5
    },

    textinput: {
        width: Dimensions.get('window').width - 24
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderColor: '#DCDCDC',
        height: 60,
        borderWidth: 0.5
    },
});