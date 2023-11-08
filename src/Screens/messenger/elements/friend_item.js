import React, { Component } from 'react';
import { View, Text, Image ,TouchableOpacity } from 'react-native';
import styles from '../style/style_friend';

class FriendItem extends Component {
    render() {
        const {item} = this.props;
        return (
            <TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.bgAvatar}>
                        <Image
                            source={{uri: item.avatar}}
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