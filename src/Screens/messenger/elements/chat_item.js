import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, Image ,TouchableOpacity } from 'react-native';
import styles from '../style/style_item';


function Item (props) {
    
    
        const {item} = props;
        // console.log(item);
        const {navigation} = props;
        let av = "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-13.jpg";
        const [lastMessage, setLastMessage] = useState("ô");
        const [numNewMessage, setNumNewMessage] = useState("");
        useEffect(() => {
            setLastMessage(item.lastMessage.message);
            setNumNewMessage(item.numNewMessage);
        })
       return (
        <TouchableOpacity onPress={()=>{navigation.navigate('chatscreen', {userId: item.partner.id, userName: item.partner.username, avatar: item.partner.avatar})}}>
        <View style={styles.container}>
            <View style={styles.bgAvatar}>
                <Image
                    source={(!item.partner?.avatar) ? require('../../../../assets/images/default_avatar.jpg'): {uri: item.partner.avatar}}
                    style={styles.avatar}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.partner.username}</Text>
                {(numNewMessage>0)? (<Text numberOfLines={1} style={{fontSize: 15, fontWeight: 'bold'}}>{lastMessage}</Text>):(<Text numberOfLines={1}>{lastMessage}</Text>)}
            </View>

            {(numNewMessage<=0)? (<View style={styles.bgSeen}>
                <Image
                    source={(!item.partner?.avatar) ? require('../../../../assets/images/default_avatar.jpg'): {uri: item.partner.avatar}}
                    style={styles.avatarSeen}
                />
            </View>):(<View style={styles.bgSeen}>
                <Image
                    source={
                        require('../../../../assets/icons/tich-xanh.png')
                      }
                    style={styles.avatarSeen}
                />
            </View>)}
        </View>
    </TouchableOpacity>
    )
    

}

export default Item


