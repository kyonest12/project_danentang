import React, { Component } from 'react';
import { View, Text, Image ,TouchableOpacity } from 'react-native';
import styles from '../style/style_item';

class Item extends Component {

    render() {
        const {item} = this.props;
        console.log(item)

       return (
        <TouchableOpacity>
        <View style={styles.container}>
            <View style={styles.bgAvatar}>
                <Image
                    source={{uri: item.avatar}}
                    style={styles.avatar}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text numberOfLines={1}>{item.description}</Text>
            </View>
            <View style={styles.bgSeen}>
                <Image
                    source={{uri: item.avatar}}
                    style={styles.avatarSeen}
                />
            </View>
        </View>
    </TouchableOpacity>
    )
    }

}

export default Item


