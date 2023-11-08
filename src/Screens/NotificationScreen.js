import React, { useEffect, useState, memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import {
    _getCache,
    _setCache
} from '../Services/Helper/common';
function NotificationScreen() {
    const { userList, isLoading } = useSelector(
        (state) => state.user
    );
    useEffect(() => {
    }, []);
    return (
        <View>
            <Text>Notification</Text>
        </View>
    );
}


export default memo(NotificationScreen);
