import React, { Component } from 'react'
import { View, FlatList, Text, TextInput, ScrollView } from 'react-native'
import data from '../data';
import Item from '../elements/chat_item';
import styles from '../style/style_item';
import FriendItem from '../elements/friend_item';

function Messager() {
    const inputRef = React.createRef(null);

    return(
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
                    maxLength={40}/>
                </View>
                <View style={styles.friendItem}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ref={inputRef}
                        data={ data }
                        renderItem={({ item }) => (
                            <FriendItem item={ item } />
                        )}
                        keyExtractor={(item) => item.id } // tránh trùng các item với nhau
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
                    {data.map((e, index) =>
                        <Item item = {e} keyExtractor={(e)=> e.id}/>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default Messager;

