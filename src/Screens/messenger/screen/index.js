import React, { Component, useEffect, useState } from 'react'
import { View, FlatList, Text, TextInput, ScrollView } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import dataFake from '../data';
import Item from '../elements/chat_item';
import styles from '../style/style_item';
import FriendItem from '../elements/friend_item';

function Messager({ navigation, socket }) {
    const [listConversation, setListCoversation] = useState([]);
    const { user } = useSelector(
        (state) => state.auth
    );
    const inputRef = React.createRef(null);
    useEffect(() => {
        socket?.emit('client_get_list_conversation', {
            token: user.token,
            thisUserId: user.id
        })
        socket?.on('server_send_list_conversation', (data) => {
            console.log('server_send_list_conversation', JSON.stringify(data));
            setListCoversation(data.data);
            console.log("kkk: " +  typeof listConversation);
        })
    }, [socket])
    return (
        <View style={styles.wrapper}>
            <View>
                <Text style={styles.title}>My friend</Text>
            </View>
            <ScrollView>
                <View style={styles.searchView}>
                    <TextInput
                        editable
                        style={styles.search}
                        placeholder='Search...'
                        maxLength={40} />
                </View>
                <View style={styles.friendItem}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ref={inputRef}
                        data={dataFake}
                        renderItem={({ item }) => (
                            <FriendItem item={item} navigation={navigation}/>
                        )}
                        keyExtractor={(item) => item.id} // tránh trùng các item với nhau
                    />
                </View>
                <View style={styles.chatItem}>
                    {/* <FlatList
                        ref={inputRef}
                        data={ data }
                        renderItem={({ item }) => (
                            <Item item={ item } />
                        )}
                        keyExtractor={(item) => item.id } // tránh trùng các item với nhau
                    /> */}
                    {listConversation.map((e, index) =>
                        <Item key={index}
                        item={e} navigation={navigation} keyExtractor={(e) => e.id} />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default Messager;

