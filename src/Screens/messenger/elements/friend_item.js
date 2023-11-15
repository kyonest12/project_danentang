import React, { Component } from 'react';
import { View, Text, Image ,TouchableOpacity } from 'react-native';
import styles from '../style/style_friend';

class FriendItem extends Component {
    render() {
        const {item} = this.props;
        const {navigation} = this.props;
        let av = "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-13.jpg";
        return (
            <TouchableOpacity
            onPress={()=>{navigation.navigate('chatscreen', {userId: item.id, userName: item.name, avatar: item.avatar})}}
            >
                <View style={styles.container}>
                    <View style={styles.bgAvatar}>
                        <Image
                            source={(!item.avatar) ? require('../../../../assets/images/default_avatar.jpg'): {uri: item.avatar}}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.name}>
                    <Text style={styles.name}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default FriendItem;